import { NextRequest, NextResponse } from "next/server";
import mongoose, { connectDB, disconnectDB } from "@/utils/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // To generate unique image numbers
import { Buffer } from "buffer";

// MongoDB schema (example)
const CaptchaSchema = new mongoose.Schema({
  imageBase64: String,
  imageNumber: String,
  imageText: String,
});
 

// empty commit for redeploy
const Captcha =
  mongoose.models.captcha || mongoose.model("captcha", CaptchaSchema);

const NEXT_PRIVATE_CAPTCHA_IMAGE_URI = process.env.NEXT_PRIVATE_CAPTCHA_IMAGE_URI || "";

export async function GET() {
  try {
    let imageBase64 = "";
    const maxAttempts = 10; // Avoid infinite loop
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Fetch CAPTCHA image
      const imageResponse = await axios.get(NEXT_PRIVATE_CAPTCHA_IMAGE_URI, {
        responseType: "arraybuffer",
      });

      // Convert image to base64
      imageBase64 = Buffer.from(imageResponse.data, "binary").toString(
        "base64"
      );

      // Connect to MongoDB if not already connected
      if (mongoose.connection.readyState !== 1) {
        await connectDB();
      }

      // Check if the image already exists in the database
      const imgExist = await Captcha.findOne({ imageBase64 });
      if (!imgExist) {
        break; // Unique image found, exit the loop
      }
      attempts += 1;
    }

    // If no unique image found after maxAttempts
    if (attempts >= maxAttempts || !imageBase64) {
      return NextResponse.json(
        { error: "Failed to fetch unique image from NEXT_PRIVATE_CAPTCHA_IMAGE_URI." },
        { status: 500 }
      );
    }

    // Generate unique image number
    const imageNumber = uuidv4();

    // Save base64 image and imageNumber to MongoDB
    const captcha = new Captcha({ imageBase64, imageNumber, imageText: "" });
    await captcha.save();

    // Disconnect from MongoDB after saving the image
    await disconnectDB();

    // Set response and cookie
    const response = NextResponse.json({
      image: `data:image/png;base64,${imageBase64}`,
      imageNumber: imageNumber,
    });

    return response;
  } catch (error) {
    console.error("Error fetching image or storing in MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch or save image." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageNumber, imageText } = await req.json();

    // Validation: Check if imageNumber and imageText are provided
    if (!imageNumber || !imageText) {
      return NextResponse.json(
        { error: "Invalid imageNumber or imageText." },
        { status: 400 }
      );
    }

    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Update the document where imageNumber matches
    const result = await Captcha.updateOne({ imageNumber }, { imageText });

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update imageText. Document not found." },
        { status: 404 }
      );
    }

    // Disconnect from MongoDB
    await disconnectDB();

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating imageText in MongoDB:", error);

    // Ensure disconnection if any error occurs
    if (mongoose.connection.readyState === 1) {
      await disconnectDB();
    }

    return NextResponse.json(
      { error: "Failed to update imageText due to server error." },
      { status: 500 }
    );
  }
}
