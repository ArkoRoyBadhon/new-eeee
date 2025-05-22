"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { modificationApi, orderApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import OrderSetup from "./OrderSetup";

const OrderOperationsSeller = ({
  id,
  order,
  setOrderStatus,
  isModification,
  setIsModification,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const { token, user } = useSelector((state) => state.auth);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [showSetupConfirmation, setShowSetupConfirmation] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [modificationData, setModificationData] = useState();
  const [setupData, setSetupData] = useState();
  const [requestModification, setRequestModification] = useState([]);

  const handleSubmitModification = async () => {
    try {
      console.log("Modification Data:", modificationData);

      const response = await modificationApi.createModification(
        modificationData,
        token
      );

      toast.success("Modification request sent successfully!");
      setIsModification(false);
    } catch (error) {
      toast.error("Failed to submit modification request");
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }
    try {
      const response = await orderApi.updateOrder(
        id,
        { status: "Cancelled", cancelNote: cancelReason },
        token
      );
      toast.success("Order cancelled successfully!");
      setOrderStatus(response.status);
      setShowCancelModal(false); // Close the modal here
      setCancelReason("");
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    }
  };

  const orderProcess = async (action) => {
    try {
      if (action === "Confirm") {
        let response;

        if (user?.role === "buyer") {
          if (order.sellerConfirm) {
            response = await orderApi.updateOrder(
              id,
              {
                status: "Pending",
                buyerConfirm: true,
              },
              token
            );
            toast.success("Order confirmed successfully!");
            setOrderStatus(response.status);
          } else {
            response = await orderApi.updateOrder(
              id,
              {
                status: "Not_Confirm",
                buyerConfirm: true,
              },
              token
            );

            toast.success("Order confirmed successfully!");
            setOrderStatus(response.status);
          }
        } else if (user?.role === "seller") {
          if (order.buyerConfirm) {
            response = await orderApi.updateOrder(
              id,
              {
                status: "Pending",
                sellerConfirm: true,
              },
              token
            );

            toast.success("Order confirmed successfully!");
            setOrderStatus(response.status);
          } else {
            toast.warning("Buyer has not confirmed the order yet.");
          }
        }
      }
    } catch (error) {
      toast.error("Failed to process order");
      console.error(error);
    }
  };

  const handleApprove = async () => {
    try {
      if (requestModification.length === 0) return;

      const response = await modificationApi.updateModification(
        id,
        requestModification[0]._id,
        { status: "Approved" },
        token
      );

      await orderApi.updateOrder(
        id,
        {
          status: "Not_Confirm",
          quantity: requestModification[0].quantity,
          color: requestModification[0].color,
          material: requestModification[0].material,
          additionalNote: requestModification[0].additionalNote,
          total: requestModification[0].total,
        },
        token
      );

      toast.success("Modification request approved successfully!");
      setRequestModification([]);
      await fetchModifications();
    } catch (error) {
      toast.error("Failed to approve modification request");
    }
  };

  const handleReject = async () => {
    try {
      if (requestModification.length === 0) return;

      const response = await modificationApi.updateModification(
        id,
        requestModification[0]._id,
        { status: "Rejected" },
        token
      );
      toast.success("Modification request rejected successfully!");
      setRequestModification([]);
      await fetchModifications();
    } catch (error) {
      toast.error("Failed to reject modification request");
    }
  };

  const fetchModifications = async () => {
    try {
      const response = await modificationApi.getModification(id, token);
      const filter = response.data.modifications.filter(
        (item) => item.requestedBy._id !== user?._id
      );
      setRequestModification(filter);
    } catch (error) {
      console.error("Error fetching modifications:", error);
      setRequestModification([]);
    }
  };

  const handleOrderSetupSubmit = async () => {
    try {
      setIsSettingUp(true);
      const response = await orderApi.updateOrder(
        id,
        {
          paymentTerms: setupData?.paymentTerms,
          status: "Not_Confirm",
          deliverTime: setupData.deliverTime,
        },
        token
      );

      toast.success("Order setup completed successfully!");
      // setOrderStatus(response.status);
      setShowSetupForm(false);
      setShowSetupConfirmation(false);
    } catch (error) {
      toast.error("Failed to update order setup");
      console.error(error);
    } finally {
      setIsSettingUp(false);
    }
  };

  useEffect(() => {
    fetchModifications();
  }, [id]);
  useEffect(() => {
    if (order) {
      setSetupData({
        quantity: order.quantity || 1,
        color: order.color || "",
        material: order.material || "",
        additionalNote: order.additionalNote || "",
        price: order.price || 0,
        total: order.total || order.price * order.quantity,
        deliverTime: order.deliverTime ? new Date(order.deliverTime) : null,
      });
      setModificationData({
        quantity: order.quantity || 1,
        color: order.color || "",
        material: order.material || "",
        additionalNote: order.additionalNote || "",
        price: order.price || 0,
        total: order.total || 0,
        requestedBy: user._id,
        orderId: id,
      });
    }
  }, [order]);

  return (
    <>
      <Card className="bg-[#FDF5E5] border-none">
        {isModification ? (
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">Order Modification</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModification(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You're requesting to modify this order. Please update the
                details below:
              </p>

              {/* Current Order Details */}
              <div className="bg-white p-4 rounded-lg border mb-4 text-[14px] custom-text">
                <h4 className="font-medium mb-2">Current Order Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <p className="font-medium text-[#555555]">
                      {order?.quantity || 0}
                    </p>
                  </div>
                  <div>
                    <Label>Color</Label>
                    <p className="font-medium text-[#555555]">
                      {order?.color || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Note</Label>
                    <p className="font-medium text-[#555555]">
                      {order?.additionalNote || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="setupQuantity" className="pb-1">
                    Quantity
                  </Label>
                  <Input
                    id="setupQuantity"
                    type="number"
                    value={modificationData?.quantity}
                    onChange={(e) =>
                      setModificationData({
                        ...modificationData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="setupPrice" className="pb-1">
                    Unit Price ($)
                  </Label>
                  <Input
                    id="setupPrice"
                    type="number"
                    value={modificationData.price}
                    onChange={(e) =>
                      setModificationData({
                        ...modificationData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="pb-1">Total ($)</Label>
                  <Input
                    value={modificationData.total}
                    type="number"
                    onChange={(e) =>
                      setModificationData({
                        ...modificationData,
                        total: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="setupColor" className="pb-1">
                    Color
                  </Label>
                  <Input
                    id="setupColor"
                    value={modificationData.color}
                    onChange={(e) =>
                      setModificationData({
                        ...modificationData,
                        color: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="setupMaterial" className="pb-1">
                    Material
                  </Label>
                  <Input
                    id="setupMaterial"
                    value={modificationData.material}
                    onChange={(e) =>
                      setModificationData({
                        ...modificationData,
                        material: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="setupNote" className="pb-1">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="setupNote"
                    value={modificationData.additionalNote}
                    onChange={(e) =>
                      setModificationData({
                        ...modificationData,
                        additionalNote: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModification(false)}
                  className="hover:bg-[#DFB547]/90 rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#001C44] hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                  onClick={handleSubmitModification}
                >
                  Submit Modification Request
                </Button>
              </div>
            </div>
          </CardContent>
        ) : showSetupForm ? (
          <OrderSetup
            setupData={setupData}
            setSetupData={setSetupData}
            setShowSetupForm={setShowSetupForm}
            setShowSetupConfirmation={setShowSetupConfirmation}
          />
        ) : (
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">
              Waiting for {`${user?.role === "buyer" ? "Supplier" : "Buyer"}`}{" "}
              to confirm order
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              The order will be paid via Payment Terms. You need to confirm the
              order, then pay the initial payment, and then pay the remaining
              balance within 30 days after the order is shipped.
            </p>

            <div className="flex items-center flex-wrap gap-3">
              {user?.role === "buyer" &&
                (order.buyerConfirm ? (
                  <p className="text-[14px] text-[#555555]">
                    Wait for seller confirmation
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPendingAction("Confirm");
                      setShowConfirmModal(true);
                    }}
                    className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                  >
                    Confirm order
                  </Button>
                ))}

              {user?.role === "seller" &&
                (order.sellerConfirm ? (
                  <p className="text-[14px] text-[#555555]">
                    Wait for Buyer confirmation
                  </p>
                ) : order?.deliverTime ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPendingAction("Confirm");
                      setShowConfirmModal(true);
                    }}
                    className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                  >
                    Confirm order
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.warning("Please set delivery time in Order Setup");
                    }}
                    className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                  >
                    Confirm order
                  </Button>
                ))}

              {user?.role === "buyer" && !order.buyerConfirm && (
                <Button
                  variant="outline"
                  onClick={() => setIsModification(true)}
                  className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                >
                  Request modification
                </Button>
              )}
              <Button
                onClick={() => {
                  setPendingAction("Cancel");
                  setShowCancelModal(true);
                }}
                variant="outline"
                className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
              >
                Cancel order
              </Button>

              {user?.role === "seller" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSetupForm(true);
                  }}
                  className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]"
                >
                  Order Setup
                </Button>
              )}
            </div>

            <div className="flex">
              <div className="w-full flex gap-4 mt-5">
                {requestModification.length > 0 && (
                  <div className="w-full bg-[#FDF5E5] p-4 rounded-lg border">
                    <h3 className="text-[#555555] font-bold">
                      A Request Modification is Here
                    </h3>
                    <p className="text-sm text-[#555555] mt-2">
                      <strong>Quantity:</strong>{" "}
                      {requestModification[0]?.quantity}
                    </p>
                    <p className="text-sm text-[#555555]">
                      <strong>Color:</strong> {requestModification[0]?.color}
                    </p>
                    <p className="text-sm text-[#555555]">
                      <strong>Material:</strong>{" "}
                      {requestModification[0]?.material}
                    </p>
                    <p className="text-sm text-[#555555]">
                      <strong>Note:</strong>{" "}
                      {requestModification[0]?.additionalNote}
                    </p>
                    <p className="text-sm text-[#555555]">
                      <strong>Total Price:</strong> ${" "}
                      {requestModification[0]?.total}
                    </p>
                    <p className="text-sm text-[#555555]">
                      <strong>Requested By:</strong>{" "}
                      {requestModification[0]?.requestedBy?.firstName}{" "}
                      {requestModification[0]?.requestedBy?.lastName}
                    </p>
                    <p className="text-sm text-[#555555]">
                      <strong>Date:</strong>{" "}
                      {requestModification[0]?.requestedAt}
                    </p>

                    <div className="flex gap-4 mt-4">
                      {requestModification.length > 0 ? (
                        <>
                          {/* Approval Section */}
                          {requestModification[0].status === "Approved" ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-green-600">Approved</span>
                            </div>
                          ) : requestModification[0].status === "Pending" ? (
                            <Button
                              onClick={handleApprove}
                              disabled={isApproving}
                              className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] text-black"
                            >
                              {isApproving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                          ) : null}

                          {/* Rejection Section */}
                          {requestModification[0].status === "Rejected" ? (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-red-600">Rejected</span>
                            </div>
                          ) : requestModification[0].status === "Pending" ? (
                            <Button
                              onClick={handleReject}
                              disabled={isRejecting}
                              className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] text-black"
                            >
                              {isRejecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                          ) : null}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No modification requests
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Confirm Order Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-xs custom-shadow bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="font-medium mb-4">Confirm Order</h3>
            <p className="mb-6">Are you sure you want to confirm this order?</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  orderProcess(pendingAction);
                  setShowConfirmModal(false);
                }}
                className="bg-[#DFB547] hover:bg-[#DFB547]/90"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal with Reason */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs custom-shadow flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="font-medium mb-4">Cancel Order</h3>
            <p className="mb-4">Are you sure you want to cancel this order?</p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Reason for cancellation (required)
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please specify the reason for cancellation..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
              >
                No, Go Back
              </Button>
              <Button
                onClick={handleCancelOrder}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!cancelReason.trim()}
              >
                Yes, Cancel Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Order Setup Modal */}
      {showSetupConfirmation && (
        <div className="fixed inset-0 backdrop-blur-xs custom-shadow bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="font-medium mb-4">Confirm Order Setup</h3>
            <div className="mb-4 space-y-2">
              <p>You're about to update this order with:</p>
              <ul className="list-disc pl-5 text-sm">
                <li>Quantity: {setupData.quantity}</li>
                <li>Unit Price: ${setupData.price.toFixed(2)}</li>
                <li>
                  Total: ${(setupData.price * setupData.quantity).toFixed(2)}
                </li>
                <li>Delivery: {setupData.deliverTime?.toLocaleDateString()}</li>
              </ul>
              <p className="mt-2">Are you sure you want to proceed?</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSetupConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOrderSetupSubmit}
                className="bg-[#DFB547] hover:bg-[#DFB547]/90"
                disabled={isSettingUp}
              >
                {isSettingUp ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Confirm Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderOperationsSeller;
