"use client";
const deleteImage = async (publicId) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dlfxrxafc/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          // Optionally include 'invalidate: true' to clear the cache
          invalidate: true,
          api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
          api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete image from Cloudinary");
    }

    const data = await response.json();
    if (data.result === "ok") {
      console.log("Image deleted successfully");
      // Handle success (e.g., update state or UI)
    } else {
      throw new Error("Image deletion failed");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
