"use client";

import { useState, useRef, useEffect } from "react";
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

export default function MultiImageUploader({
  selectedImages,
  setSelectedImages,
  imagePreviews,
  setImagePreviews,

  // new
  uploadedImages = [],
  onRemoveImage,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (files) => {
    const selectedFiles = Array.from(files);
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit
    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= maxFileSize
    );

    const existingCount = selectedImages.length;
    const totalCount = existingCount + validFiles.length;

    if (totalCount > 5) {
      toast.warning(
        `You can only upload up to 5 images. ${
          5 - existingCount
        } slots remaining.`
      );
      validFiles.splice(5 - existingCount);
    }

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    // Update state
    setSelectedImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    if (index < uploadedImages.length) {
      onRemoveImage(index);
    } else {
      const adjustedIndex = index - uploadedImages.length;
      const urlToRevoke = imagePreviews[adjustedIndex];
      URL.revokeObjectURL(urlToRevoke);

      setSelectedImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      <Card
        className={`border-dashed bg-[#F2F2F2] ${
          isDragActive ? "border-primary  bg-primary/10" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center text-center space-y-2 cursor-pointer "
        >
          <div className="rounded-full bg-primary/10 p-4">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Drag images here or click to browse</h3>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, GIF up to 5MB
            </p>
          </div>
        </CardContent>
      </Card>

      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {imagePreviews.map((url, index) => (
            <Card key={index} className="overflow-hidden group relative p-0">
              <CardContent className="p-0">
                <Image
                  src={url}
                  height={40}
                  width={40}
                  alt={`Preview ${index + 1}`}
                  className="w-[80px] h-[80px] object-cover"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-[2px] right-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <X className="h-1 w-1" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          ))}
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
    </div>
  );
}
