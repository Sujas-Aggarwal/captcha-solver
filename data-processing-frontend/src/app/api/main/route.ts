import { NextRequest, NextResponse } from "next/server";
import mongoose, { connectDB, disconnectDB } from "@/utils/db";

// MongoDB schema (example)
const ImageNameSchema = new mongoose.Schema({
  image: String,  // Base64 image
  label: String,
  number: String,
  text: String,
});

const ImageName =
  mongoose.models.image_name || mongoose.model("image_name", ImageNameSchema);

export async function GET() {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Fetch a document where text is an empty string
    const imageDoc = await ImageName.findOne({ text: "" });

    // Handle the case when no such document is found
    if (!imageDoc) {
      await disconnectDB();
      return NextResponse.json(
        { error: "No available image with an empty text field." },
        { status: 404 }
      );
    }

    const { image, number } = imageDoc;

    // Disconnect from MongoDB after fetching the image
    await disconnectDB();

    // Return the base64 image and number in the response
    const response = NextResponse.json({
      image: `data:image/png;base64,${image}`,
      imageNumber: number,
    });

    return response;
  } catch (error) {
    console.error("Error fetching image from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch image." },
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

    // Update the document where number matches and text is empty
    const result = await ImageName.updateOne(
      { number: imageNumber, text: "" },
      { text: imageText }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update text. Document not found or already updated." },
        { status: 404 }
      );
    }

    // Disconnect from MongoDB
    await disconnectDB();

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating text in MongoDB:", error);

    // Ensure disconnection if any error occurs
    if (mongoose.connection.readyState === 1) {
      await disconnectDB();
    }

    return NextResponse.json(
      { error: "Failed to update text due to server error." },
      { status: 500 }
    );
  }
}
