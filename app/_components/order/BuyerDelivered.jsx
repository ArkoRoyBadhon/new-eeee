"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  DollarSign,
  Copy,
  ExternalLink,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BuyerDelivered = ({ id, order, setOrderStatus }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnProofs, setReturnProofs] = useState([]);
  const [returnReason, setReturnReason] = useState("");
  const { token } = useSelector((state) => state.auth);

  const handleConfirmOrder = async () => {
    try {
      setIsConfirming(true);
      const response = await orderApi.updateOrder(
        id,
        { status: "Completed" },
        token
      );
      setOrderStatus(response.status);
      toast.success("Order confirmed successfully!");
    } catch (error) {
      toast.error("Failed to confirm order");
      console.error(error);
    } finally {
      setIsConfirming(false);
    }
  };

  const uploadToCloudinary = async (files) => {
    const uploadedUrls = [];

    for (const file of files) {
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
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const handleReturnRequest = async () => {
    if (returnProofs.length === 0) {
      toast.error("Please upload at least one return proof");
      return;
    }

    if (!returnReason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }

    try {
      setIsProcessingReturn(true);
      const returnProofUrls = await uploadToCloudinary(returnProofs);

      const response = await orderApi.updateOrder(
        id,
        {
          status: "Delivered",
          returnRequested: true,
          returnProofUrls, // Now an array of URLs
          returnReason,
          returnRequestedAt: new Date().toISOString(),
          returnStatus: "Pending",
        },
        token
      );

      setOrderStatus(response.status);
      toast.success("Return request submitted successfully!");
      setShowReturnModal(false);
      setShowReturnForm(false);
      setReturnProofs([]);
      setReturnReason("");
    } catch (error) {
      toast.error("Failed to submit return request");
      console.error(error);
    } finally {
      setIsProcessingReturn(false);
    }
  };

  const handleReturnProofsUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setReturnProofs((prev) => [...prev, ...newFiles]);
    }
  };

  const removeProof = (index) => {
    setReturnProofs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        {/* Order Delivered Section */}
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div>
            <h3 className="text-[#555555] font-medium">
              Your order has been delivered!
            </h3>
            <p className="text-sm text-[#555555]">
              Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
            </p>
          </div>

          {order.status === "Completed" ? (
            <Badge className="ml-auto bg-green-500/10 text-green-600 hover:bg-green-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Confirmed
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="ml-auto border-green-500 text-green-600 hover:bg-green-50"
              onClick={handleConfirmOrder}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Confirm Receipt
            </Button>
          )}
        </div>

        <div className="pt-4 border-t border-[#DFB547]/20 space-y-4">
          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#555555]">
                Tracking information
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={order.trackingNumber}
                  readOnly
                  className="bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(order.trackingNumber);
                    toast.success("Tracking number copied!");
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://trackingservice.com/?track=${order.trackingNumber}`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Track
                </Button>
              </div>
            </div>
          )}

          {/* Delivery Proof */}
          {order.deliveryProof && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#555555]">
                Delivery Proof
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(order.deliveryProof, "_blank")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Delivery Document
              </Button>
            </div>
          )}

          {/* Return/Refund Section */}
          <div className="space-y-3">
            <h4 className="text-[#555555] font-medium">
              Need help with your order?
            </h4>

            {order.returnRequested ? (
              <Badge className="bg-[#DFB547]/10 text-[#DFB547] hover:bg-[#DFB547]/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Return Request Submitted
              </Badge>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowReturnForm(true)}
                disabled={order.status === "Completed"}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Request Return
              </Button>
            )}
          </div>

          {/* Return Form */}
          {showReturnForm && (
            <div className="pt-4 space-y-4">
              <div>
                <Label htmlFor="returnProofs">Return Proof*</Label>
                <div className="mt-2 space-y-3">
                  <Label
                    htmlFor="returnProofs"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#001C44] transition-colors"
                  >
                    <Upload className="h-6 w-6 text-gray-500 mb-2" />
                    <span className="text-sm">
                      Upload Proof (Multiple files allowed)
                    </span>
                    <span className="text-xs text-gray-500">
                      (Photos of damaged/inaccurate product)
                    </span>
                    <Input
                      id="returnProofs"
                      type="file"
                      className="hidden"
                      onChange={handleReturnProofsUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                    />
                  </Label>

                  {returnProofs.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {returnProofs.map((proof, index) => (
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

              <div>
                <Label>Reason for Return*</Label>
                <Textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please explain why you want to return this item..."
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReturnForm(false);
                    setReturnProofs([]);
                    setReturnReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowReturnModal(true)}
                  disabled={returnProofs.length === 0 || !returnReason.trim()}
                  className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
                >
                  Submit Return Request
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Return Confirmation Modal */}
        <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Return Request</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to request a return for this order?</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">
                  You're uploading {returnProofs.length} proof files:
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5">
                  {returnProofs.slice(0, 3).map((proof, index) => (
                    <li key={index} className="truncate">
                      {proof.name}
                    </li>
                  ))}
                  {returnProofs.length > 3 && (
                    <li>and {returnProofs.length - 3} more...</li>
                  )}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowReturnModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReturnRequest}
                disabled={isProcessingReturn}
                className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
              >
                {isProcessingReturn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Confirm Return
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BuyerDelivered;
