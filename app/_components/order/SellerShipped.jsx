"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orderApi } from "@/lib/api";
import { uploadToCloudinary } from "@/utils/uploadCloudinary";
import {
  Copy,
  FileText,
  Loader2,
  ShieldAlert,
  Truck,
  Upload,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const SellerShipped = ({ id, order, setOrderStatus }) => {
  const [deliveryProofs, setDeliveryProofs] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleDeliveryProofsUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setDeliveryProofs([...deliveryProofs, ...newFiles]);
    }
  };

  const removeDeliveryProof = (index) => {
    setDeliveryProofs(deliveryProofs.filter((_, i) => i !== index));
  };

  

  const handleMarkAsDelivered = async () => {
    if (deliveryProofs.length === 0) {
      toast.error("Please upload at least one delivery proof");
      return;
    }

    setIsUpdatingStatus(true);

    try {
      // Upload all files in parallel
      const uploadPromises = deliveryProofs.map((file) =>
        uploadToCloudinary(file)
      );
      const deliveryProof = await Promise.all(uploadPromises);

      const response = await orderApi.updateOrder(
        id,
        {
          status: "Delivered",
          deliveryProof: deliveryProof, // Changed to array
        },
        token
      );

      setOrderStatus(response.status);
      toast.success("Order marked as delivered successfully!");
      setDeliveryProofs([]);
    } catch (error) {
      toast.error("Failed to confirm delivery");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      {order.isDispatch ? (
        <CardContent className="p-6">
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#FFA500]" />
              <h3 className="text-[#555555] font-medium">Order is Shipped</h3>
            </div>

            {order?._id && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#555555]">
                  Tracking Information
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {order._id}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#001C44] hover:bg-[#001C44]/10"
                    onClick={() => {
                      navigator.clipboard.writeText(order._id);
                      toast.success("Tracking number copied!");
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            )}

            {/* Delivery confirmation section */}
            <div className="space-y-2">
              <Label htmlFor="deliveryProofs">Delivery Confirmation *</Label>
              <div className="flex flex-col gap-4">
                <Label
                  htmlFor="deliveryProofs"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#001C44] transition-colors"
                >
                  <Upload className="h-6 w-6 text-gray-500 mb-2" />
                  <span className="text-sm">Upload Proofs</span>
                  <span className="text-xs text-gray-500">
                    (Delivery confirmation, Customer signature, etc.)
                  </span>
                  <Input
                    id="deliveryProofs"
                    type="file"
                    className="hidden"
                    onChange={handleDeliveryProofsUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                  />
                </Label>

                {deliveryProofs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {deliveryProofs.map((proof, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 text-sm bg-gray-100 px-3 py-2 rounded"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{proof.name}</span>
                        </div>
                        <button
                          onClick={() => removeDeliveryProof(index)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleMarkAsDelivered}
              className="bg-[#001C44] hover:bg-[#001C44]/90 text-white self-start"
              size="sm"
              disabled={deliveryProofs.length === 0 || isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Marking as Delivered...
                </>
              ) : (
                "Mark as Delivered"
              )}
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">
                Awaiting Admin Approval
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Your request is being reviewed. You'll be notified once
                approved.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SellerShipped;
