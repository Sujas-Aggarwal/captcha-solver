import { NextRequest, NextResponse } from "next/server";
import mongoose, { connectDB, disconnectDB } from "@/utils/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // To generate unique image numbers
import { Buffer } from "buffer";

// MongoDB schema (example)
const CaptchaSchema = new mongoose.Schema({
  imageBase64: String,
  imageNumber: String,
});

const Captcha =
  mongoose.models.Captcha || mongoose.model("Captcha", CaptchaSchema);

const CAPTCHA_IMAGE_URI = process.env.CAPTCHA_IMAGE_URI || "";

export async function GET(req: NextRequest) {
  try {
    let imageBase64 = "";
    let maxAttempts = 10; // Avoid infinite loop
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Fetch CAPTCHA image
      const imageResponse = await axios.get(CAPTCHA_IMAGE_URI, {
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
        { error: "Failed to fetch unique image from CAPTCHA_IMAGE_URI." },
        { status: 500 }
      );
    }

    // Generate unique image number
    const imageNumber = uuidv4();

    // Save base64 image and imageNumber to MongoDB
    const captcha = new Captcha({ imageBase64, imageNumber });
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
