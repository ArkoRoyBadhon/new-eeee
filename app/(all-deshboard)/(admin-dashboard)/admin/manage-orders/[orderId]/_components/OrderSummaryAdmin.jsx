"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { disputeApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const OrderSummaryAdmin = ({
  order,
  setVerifyFundButton,
  setVerifyShippedButton,
  refreshOrder,
}) => {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [modifiedDetails, setModifiedDetails] = useState({
    quantity: order.quantity,
    color: order.color,
    material: order.material,
    additionalNote: order.additionalNote,
  });
  const [resolutionNote, setResolutionNote] = useState("");
  const { token } = useSelector((state) => state.admin);

  const handleDisputeClick = (dispute) => {
    setSelectedDispute(dispute);
    // Reset modification state when viewing a dispute
    setModifiedDetails({
      quantity: order.quantity,
      color: order.color,
      material: order.material,
      additionalNote: order.additionalNote,
    });
    setResolutionNote("");
  };

  const handleBackToSummary = () => {
    setSelectedDispute(null);
  };

  const handleModifyChange = (field, value) => {
    setModifiedDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApproveDispute = async () => {
    try {
      setIsResolving(true);
      const response = await disputeApi.updateDispute(
        order?._id,
        selectedDispute?._id,
        {
          status: "approved",
          adminNote: resolutionNote,
          disputePausedActions: true,
        },
        token
      );

      console.log("Dispute approved:", response);

      toast.success("Dispute approved. Order modifications enabled.");
      await refreshOrder();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Failed to approve dispute");
    } finally {
      setIsResolving(false);
    }
  };

  const handleRejectDispute = async () => {
    try {
      setIsResolving(true);

      const response = await disputeApi.updateDispute(
        order?._id,
        selectedDispute?._id,
        {
          status: "rejected",
          adminNote: resolutionNote,
        },
        token
      );

      toast.success("Dispute rejected");
      await refreshOrder();
      setSelectedDispute(null);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Failed to reject dispute");
    } finally {
      setIsResolving(false);
    }
  };

  const handleResolveDispute = async () => {
    try {
      setIsResolving(true);

      const response = await disputeApi.updateDispute(
        order?._id,
        selectedDispute?._id,
        {
          status: "resolved",
          adminNote: resolutionNote,
          disputePausedActions: false,
          quantity: modifiedDetails.quantity,
          color: modifiedDetails.color,
          material: modifiedDetails.material,
          additionalNote: modifiedDetails.additionalNote,
        },
        token
      );

      toast.success("Dispute resolved and order updated");
      await refreshOrder();
      setSelectedDispute(null);
    } catch (error) {
      toast.error("Failed to resolve dispute");
    } finally {
      setIsResolving(false);
    }
  };

  if (selectedDispute) {
    return (
      <Card className="bg-[#FDF5E5] border-none shadow-none">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSummary}
              className="text-[#DFB547] hover:bg-[#DFB547]/10"
            >
              ← Back to Order Summary
            </Button>
          </div>

          <div className="pt-4 border-t border-[#DFB547]/20">
            <h3 className="text-lg font-medium text-[#555555] mb-4">
              Dispute Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#555555]">
                    Basic Information
                  </h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-[#555555]">Requested by:</span>
                      <span className="ml-2 capitalize">
                        {selectedDispute.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#555555]">Status:</span>
                      <Badge
                        variant={
                          selectedDispute.status === "approved"
                            ? "default"
                            : selectedDispute.status === "rejected"
                            ? "destructive"
                            : selectedDispute.status === "resolved"
                            ? "success"
                            : "outline"
                        }
                        className="ml-2"
                      >
                        {selectedDispute.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-[#555555]">Created:</span>
                      <span className="ml-2">
                        {format(new Date(selectedDispute.createdAt), "PPpp")}
                      </span>
                    </div>
                    {selectedDispute.resolvedAt && (
                      <div>
                        <span className="text-[#555555]">Resolved:</span>
                        <span className="ml-2">
                          {format(new Date(selectedDispute.resolvedAt), "PPpp")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#555555]">
                    Dispute Reason
                  </h4>
                  <p className="text-sm p-3 bg-white rounded border">
                    {selectedDispute.reason}
                  </p>
                </div>

                {selectedDispute.status === "approved" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-[#555555]">
                      Modify Order Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-[#555555]">
                          Quantity
                        </label>
                        <Input
                          type="number"
                          value={modifiedDetails.quantity}
                          onChange={(e) =>
                            handleModifyChange("quantity", e.target.value)
                          }
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#555555]">Color</label>
                        <Input
                          value={modifiedDetails.color}
                          onChange={(e) =>
                            handleModifyChange("color", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#555555]">
                          Material
                        </label>
                        <Input
                          value={modifiedDetails.material}
                          onChange={(e) =>
                            handleModifyChange("material", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#555555]">
                          Additional Note
                        </label>
                        <Textarea
                          value={modifiedDetails.additionalNote}
                          onChange={(e) =>
                            handleModifyChange("additionalNote", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {selectedDispute.documents?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#555555]">
                      Supporting Documents ({selectedDispute.documents.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedDispute.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm p-2 border rounded hover:bg-gray-50 flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-2 text-[#DFB547]" />
                          Document {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#555555]">
                    Resolution Note
                  </h4>
                  <Textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Add notes about how you resolved this dispute..."
                  />
                </div>

                {selectedDispute.status === "pending" && (
                  <div className="space-y-2 pt-4">
                    <h4 className="text-sm font-medium text-[#555555]">
                      Resolution Actions
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleApproveDispute}
                        disabled={isResolving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={handleRejectDispute}
                        disabled={isResolving}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {selectedDispute.status === "approved" && (
                  <div className="space-y-2 pt-4">
                    <h4 className="text-sm font-medium text-[#555555]">
                      Complete Resolution
                    </h4>
                    {order?.disputes?.find(
                      (dispute) => dispute.status === "resolved"
                    ) ? (
                      <Button
                        disabled={order?.disputes?.find(
                          (dispute) => dispute.status === "resolved"
                        )}
                        className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white w-full"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    ) : (
                      <Button
                        onClick={handleResolveDispute}
                        disabled={isResolving}
                        className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white w-full"
                      >
                        {isResolving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-[#DFB547]" />
          <h3 className="text-[#555555] font-medium">Order Summary</h3>
          <Badge className="ml-auto bg-[#DFB547]/10 text-[#DFB547] hover:bg-[#DFB547]/20">
            Invoice #{order.invoice || "N/A"}
          </Badge>
        </div>

        <div className="pt-4 border-t border-[#DFB547]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Order Timeline */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#555555]">
                  Order Timeline
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-[#555555]">Created:</span>
                    <span>
                      {order.createdAt
                        ? format(new Date(order.createdAt), "PPpp")
                        : "N/A"}
                    </span>
                  </div>
                  {order.confirmedAt && (
                    <div className="flex gap-2">
                      <span className="text-[#555555]">Confirmed:</span>
                      <span>{format(new Date(order.confirmedAt), "PPpp")}</span>
                    </div>
                  )}
                  {order.shippedAt && (
                    <div className="flex gap-2">
                      <span className="text-[#555555]">Shipped:</span>
                      <span>{format(new Date(order.shippedAt), "PPpp")}</span>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div className="flex gap-2">
                      <span className="text-[#555555]">Delivered:</span>
                      <span>{format(new Date(order.deliveredAt), "PPpp")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#555555]">
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {order?.paymentMethod === "OffPlatform" ? (
                    <div>
                      <span className="text-[#555555]">Method:</span>
                      <span className="ml-2 capitalize">
                        {order.paymentMethod
                          ?.replace(/([A-Z])/g, " $1")
                          .trim() || "N/A"}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-[#555555]">Method:</span>
                        <span className="ml-2 capitalize">
                          {order.paymentMethod
                            ?.replace(/([A-Z])/g, " $1")
                            .trim() || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#555555]">Status:</span>
                        <span className="ml-2 capitalize">
                          {order.payStatus || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#555555]">Upfront:</span>
                        <span className="ml-2">
                          ${order.upfrontAmount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#555555]">Post Delivery:</span>
                        <span className="ml-2">
                          ${order.postDeliveryAmount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#555555]">Total:</span>
                        <span className="ml-2">
                          ${order.total?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* order info  */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#555555]">
                  Order Info
                </h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-[#555555]">Title:</span>
                    <span className="ml-2">
                      {order.product?.title || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#555555]">Quantity:</span>
                    <span className="ml-2">
                      {order.quantity || "N/A"} pcs/units
                    </span>
                  </div>
                  <div>
                    <span className="text-[#555555]">Color:</span>
                    <span className="ml-2">{order?.color || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[#555555]">Material:</span>
                    <span className="ml-2">{order?.material || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[#555555]">Additional Note:</span>
                    <span className="ml-2">
                      {order?.additionalNote || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Shipping Information */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#555555]">
                  Shipping Information
                </h4>
                <div className="text-sm">
                  <p className=" text-[#555555]">
                    Address:{" "}
                    <span className="font-medium capitalize">
                      {order.shippingAddress || "N/A"}
                    </span>
                  </p>

                  <p className="text-[#555555]">
                    Phone: {order.shippingAddress?.phone || "N/A"}
                  </p>
                  {order._id && (
                    <div className="mt-2 text-[#555555]">
                      <span className="">Tracking:</span>
                      <span className="ml-2 font-medium">{order._id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#555555]">
                  Verification Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setVerifyFundButton(true)}
                    variant={order.isVerified ? "default" : "outline"}
                    className="bg-[#DFB547]/10 text-[#DFB547] hover:bg-[#DFB547]/20"
                  >
                    {order.isVerified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Funds Verified
                      </>
                    ) : (
                      "Funds Pending"
                    )}
                  </Button>
                  <Button
                    onClick={() => setVerifyShippedButton(true)}
                    variant={order.isDispatch ? "default" : "outline"}
                    className="bg-[#DFB547]/10 text-[#DFB547] hover:bg-[#DFB547]/20"
                  >
                    {order.isDispatch ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Dispatch Verified
                      </>
                    ) : (
                      "Dispatch Pending"
                    )}
                  </Button>
                </div>
              </div>

              {/* dispute requests  */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-600">
                  Dispute Requests ({order?.disputes?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {order?.disputes?.map((dispute) => (
                    <div
                      key={dispute.id}
                      onClick={() => handleDisputeClick(dispute)}
                      className="group flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-sm text-amber-600 underline-offset-4 group-hover:underline">
                        {dispute?.role} dispute
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          dispute.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : dispute.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {dispute.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          {(order.cancelNote ||
            order.returnStatus !== "Not" ||
            order.modifications?.length > 0) && (
            <div className="mt-6 pt-4 border-t border-[#DFB547]/20">
              {/* Cancellation Reason */}
              {order.cancelNote && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#555555]">
                    Cancellation Reason
                  </h4>
                  <p className="text-sm">{order.cancelNote}</p>
                </div>
              )}

              {/* Return Information */}
              {order.returnStatus !== "Not" && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium text-[#555555]">
                    Return Information
                  </h4>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#555555]">Status:</span>
                      <Badge
                        variant={
                          order.returnStatus === "Approved"
                            ? "default"
                            : order.returnStatus === "Rejected"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {order.returnStatus}
                      </Badge>
                    </div>
                    {order.returnReason && (
                      <div className="mt-1">
                        <span className="text-[#555555]">Reason:</span>
                        <p className="ml-2">{order.returnReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modifications */}
              {order.modifications?.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium text-[#555555]">
                    Modification Requests
                  </h4>
                  <div className="space-y-2">
                    {order.modifications.map((mod, index) => (
                      <div key={index} className="text-sm border rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Request #{index + 1}
                          </span>
                          <Badge
                            variant={
                              mod.status === "Approved"
                                ? "default"
                                : mod.status === "Rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {mod.status}
                          </Badge>
                        </div>
                        {mod.note && (
                          <div className="mt-1">
                            <span className="text-[#555555]">Note:</span>
                            <p className="ml-2">{mod.note}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryAdmin;
