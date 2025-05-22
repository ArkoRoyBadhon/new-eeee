"use client";

import { useState, useRef } from "react";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function SingleImageUploader({
  submitFormLogic,
  setSubmitFormLogic,
  setUploadedImage,
}) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const maxFileSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxFileSize) {
        toast.warning("File size exceeds the 5MB limit.");
        return;
      }

      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.warning("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.warning("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const formData = new FormData();
      formData.append("file", image);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const response = await fetch(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      URL.revokeObjectURL(previewUrl);
      setUploadedImage(data.secure_url);
      setImage(null);
      setPreviewUrl("");

      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
      setSubmitFormLogic(false);
    }
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(null);
    setPreviewUrl("");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <Card className="border-dashed cursor-pointer" onClick={triggerFileInput}>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="rounded-full bg-primary/10 p-4">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Click to upload an image</h3>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, GIF up to 5MB
            </p>
          </div>
        </CardContent>
      </Card>

      {previewUrl && (
        <div className="relative group">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={previewUrl}
                alt="Preview"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4 text-sm">
            <span>Uploading...</span>
            <Progress value={uploadProgress} />
            <span>{uploadProgress}%</span>
          </div>
        </div>
      )}

      {image && !isUploading && (
        <Button onClick={handleUpload} variant="primary">
          Upload Image
        </Button>
      )}
    </div>
  );
}
