"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orderApi } from "@/lib/api";
import { AlertCircle, FileText, Loader2, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const SellerProcessing = ({ id, order, setOrderStatus }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(id);
  const { token } = useSelector((state) => state.auth);

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleDispatch = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadPromises = uploadedFiles.map((file) =>
        uploadToCloudinary(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      // console.log("Uploaded URLs:", uploadedUrls);

      const response = await orderApi.updateOrder(
        id,
        {
          status: "Shipped",
          dispatchDocuments: uploadedUrls,
          isDispatch: false,
        },
        token
      );

      setOrderStatus(response.status);
      toast.success("Order dispatched successfully!");
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Failed to dispatch order");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6">
        {order.isVerified ? (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#FFA500]" />
              <h3 className="text-[#555555] font-medium">
                Order is Processing
              </h3>
            </div>

            <p className="text-sm text-[#555555]">
              Please prepare the items for dispatch. Once ready, update the
              status and upload required documents.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number *</Label>
                <Input
                  id="trackingNumber"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Dispatch Documents *</Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="dispatchProof"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#001C44] transition-colors"
                  >
                    <Upload className="h-6 w-6 text-gray-500 mb-2" />
                    <span className="text-sm">Upload Proof</span>
                    <span className="text-xs text-gray-500">
                      (Invoice, Shipping Label)
                    </span>
                    <Input
                      id="dispatchProof"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                    />
                  </Label>
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-col flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="truncate max-w-[160px]">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleDispatch}
              className="bg-[#001C44] hover:bg-[#001C44]/90 text-white self-start"
              size="sm"
              disabled={
                isSubmitting ||
                uploadedFiles.length === 0 ||
                !trackingNumber.trim()
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Dispatching...
                </>
              ) : (
                "Mark as Dispatched"
              )}
            </Button>
          </div>
        ) : (
          <div className="">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#FFA500]" />
              <h3 className="text-[#555555] font-medium">
                Please wait for Admin to verify funds
              </h3>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerProcessing;
