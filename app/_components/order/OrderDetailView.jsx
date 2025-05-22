"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";
import InquiryCard from "@/app/_components/InquiryCard";
import { CheckCircle2, ClockIcon, Info, Wallet, Zap } from "lucide-react";
import BuyerShipped from "@/app/_components/order/BuyerShipped";
import SellerShipped from "@/app/_components/order/SellerShipped";
import OrderProgressTracker from "@/app/_components/order/OrderProgressTracker";
import ManagePayment from "@/app/_components/order/ManagePayment";
import SellerProcessing from "./SellerProcessing";
import BuyerDelivered from "./BuyerDelivered";
import CompletedComponent from "./CompletedComponent";
import OrderOperationsSeller from "./OrderOperationsSeller";
import BuyerProcessing from "./BuyerProcessing";
import RaiseDisputeSheet from "./RaiseDisputeSheet";

const OrderDetailView = ({ id }) => {
  const [orderStatus, setOrderStatus] = useState("Not_Confirm");
  const [order, setOrder] = useState({});

  const { token, user } = useSelector((state) => state.auth);

  const [isModification, setIsModification] = useState(false);
  const getActiveStep = () => {
    switch (orderStatus) {
      case "Not_Confirm":
        return 0;
      case "Pending":
        return 1;
      case "Processing":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      case "Completed":
        return 5;
      default:
        return 0;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (!token) return;
        const response = await orderApi.getOrderbyId(id, token);
        setOrderStatus(response?.status);
        setOrder(response);
        console.log(response);
      } catch (error) {}
    })();
  }, [token, orderStatus]);

  console.log(order);

  return (
    // <div className="max-w-[791px] mx-auto py-8 px-4">
    <div className="max-w-full mx-auto py-8 px-4 overflow-hidden">
      <Card className="custom-shadow">
        <CardHeader className="pb-4 relative">
          <CardTitle>Order details</CardTitle>
          <p className="text-sm text-gray-500">
            <strong>Order number: </strong>
            {order?._id} <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt).toDateString()}
          </p>

          <div className="absolute top-0 right-[20px]">
            {order?.sellerConfirm && order?.buyerConfirm && (
              <RaiseDisputeSheet orderId={order?._id} order={order} />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrderProgressTracker activeStep={getActiveStep()} />
          {user.role === "seller" && orderStatus === "Not_Confirm" && (
            <OrderOperationsSeller
              id={id}
              order={order}
              setOrderStatus={setOrderStatus}
              isModification={isModification}
              setIsModification={setIsModification}
            />
          )}
          {user?.role === "buyer" && orderStatus === "Not_Confirm" && (
            <>
              <OrderOperationsSeller
                id={id}
                order={order}
                setOrderStatus={setOrderStatus}
                isModification={isModification}
                setIsModification={setIsModification}
              />
            </>
          )}

          {orderStatus === "Cancelled" && (
            <Card className="bg-[#FDF5E5] border-none">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Buyer Cancelled order</h3>
              </CardContent>
            </Card>
          )}
          {user?.role === "buyer" &&
            orderStatus === "Processing" &&
            orderStatus === "Shipped" &&
            orderStatus === "Delivered" && (
              <Card className="bg-[#FDF5E5] border-none">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">
                    Waiting for supplier to ship
                  </h3>
                  <div className="mb-4">
                    <Input
                      placeholder="There was a delay in dispatch. New dispatch time:"
                      className="bg-white"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Please check your order&apos;s product quality within 60
                    days after receive the goods. If there are product quality
                    issues or the supplier does not ship on time, you can apply
                    for refund on
                  </p>
                  <Button
                    variant="outline"
                    className="hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
                  >
                    Apply for refund
                  </Button>
                </CardContent>
              </Card>
            )}
          {order?.disputePausedActions ? (
            <Card className="bg-amber-50 border border-amber-100 rounded-lg shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <ClockIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 text-base md:text-lg mb-1">
                      Dispute Resolution in Progress
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Please wait for the{" "}
                      {
                        order?.disputes?.find((d) => d.status === "approved")
                          ?.role
                      }
                      's dispute to be reviewed and resolved by our admin team.
                      We appreciate your patience.
                    </p>
                    <div className="mt-3 flex items-center text-sm text-amber-700">
                      <Info className="mr-1.5 h-4 w-4" />
                      Typically resolved within 3-5 business days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {user?.role === "seller" && orderStatus === "Pending" && (
                <Card className="bg-amber-50 border border-amber-100 rounded-lg shadow-sm">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Wallet className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Waiting for {order?.paymentTerms?.upfront}% upfront
                          payment
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Buyer to pay{" "}
                          <span className="font-medium">
                            {order?.paymentTerms?.upfront}%
                          </span>{" "}
                          of total cost as deposit. The remaining{" "}
                          {100 - (order?.paymentTerms?.upfront || 0)}% will be
                          paid on delivery.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {user?.role === "buyer" && orderStatus === "Pending" && (
                <Card className="bg-[#FDF5E5 border-none shadow-none">
                  <CardContent className="p-0">
                    <ManagePayment
                      id={id}
                      order={order}
                      setOrderStatus={setOrderStatus}
                    />
                  </CardContent>
                </Card>
              )}
              {user?.role === "buyer" && orderStatus === "Processing" && (
                <BuyerProcessing order={order} />
              )}
              {user?.role === "seller" && orderStatus === "Processing" && (
                <SellerProcessing
                  id={id}
                  order={order}
                  setOrderStatus={setOrderStatus}
                />
              )}
              {user?.role === "buyer" && orderStatus === "Shipped" && (
                <BuyerShipped id={id} order={order} />
              )}
              {user?.role === "seller" && orderStatus === "Shipped" && (
                <SellerShipped
                  id={id}
                  order={order}
                  setOrderStatus={setOrderStatus}
                />
              )}
              {user?.role === "seller" && orderStatus === "Delivered" && (
                <Card className="bg-[#FDF5E5] border-none shadow-none">
                  <CardContent className="p-6">
                    <div className="w-full flex flex-col gap-6">
                      {/* Delivery confirmation header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                          <div>
                            <h3 className="text-[#555555] font-medium text-lg">
                              Order has been delivered!
                            </h3>
                            <p className="text-sm text-[#555555]">
                              Delivered on{" "}
                              {new Date(order.deliveredAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {order.buyerConfirmed && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Confirmed on{" "}
                            {new Date(
                              order.buyerConfirmedAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {user?.role === "buyer" && orderStatus === "Delivered" && (
                <BuyerDelivered
                  id={id}
                  order={order}
                  setOrderStatus={setOrderStatus}
                />
              )}
              {orderStatus === "Completed" && (
                <CompletedComponent id={id} order={order} />
              )}
            </>
          )}

          <div className="w-fit">
            <InquiryCard title="Product Details" singleConversation={order} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailView;
