"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import InquiryCard from "@/app/_components/InquiryCard";
import AdminVerifyDispatch from "../../../../../../_components/order/AdminVerifyDispatch";
import OrderProgressTracker from "../../../../../../_components/order/OrderProgressTracker";
import AdminVerifyFund from "@/app/_components/order/AdminVerifyFund";
import VerifyDelivery from "@/app/_components/order/VerifyDelivery";
import AdminReturnOrder from "@/app/_components/order/AdminReturnOrder";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import OrderSummaryAdmin from "./OrderSummaryAdmin";

const OrderDetailView = ({ id }) => {
  const [orderStatus, setOrderStatus] = useState("Not_Confirm");
  const [order, setOrder] = useState({});
  const { token, admin } = useSelector((state) => state.admin);
  const [onSuccess, setOnSuccess] = useState(null);
  const [verifyFundButton, setVerifyFundButton] = useState(false);
  const [verifyShippedButton, setVerifyShippedButton] = useState(false);
  const [verifyDeliveryButton, setVerifyDeliveryButton] = useState(false);

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

  const orderFetch = async () => {
    try {
      if (!token) return;
      const response = await orderApi.getOrderbyIdAdmin(id, token);
      setOrderStatus(response?.status);
      setOrder(response);
    } catch (error) {
      toast.error("Failed to fetch order details");
    }
  };

  useEffect(() => {
    orderFetch();
  }, [token, orderStatus, onSuccess]);

  const refreshOrder = () => {
    orderFetch();
  };

  const renderStatusBadge = () => {
    const statusMap = {
      Not_Confirm: { label: "Not Confirmed", color: "bg-gray-500" },
      Pending: { label: "Pending", color: "bg-[#DFB547]" },
      Processing: { label: "Processing", color: "bg-[#DFB547]" },
      Shipped: { label: "Shipped", color: "bg-purple-500" },
      Delivered: { label: "Delivered", color: "bg-green-500" },
      Completed: { label: "Completed", color: "bg-green-700" },
      Cancelled: { label: "Cancelled", color: "bg-red-500" },
    };

    const status = statusMap[orderStatus] || statusMap["Not_Confirm"];
    return (
      <Badge className={`${status.color} text-white px-4 py-1`}>
        {status.label}
      </Badge>
    );
  };

  return (
    <div className="max-w-full mx-auto py-8 px-4 overflow-hidden space-y-4">
      <Card className="custom-shadow">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order?._id}</CardTitle>
              <CardDescription>
                Placed on{" "}
                {order.createdAt
                  ? format(new Date(order.createdAt), "PPpp")
                  : "N/A"}
              </CardDescription>
            </div>
            {renderStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <OrderProgressTracker activeStep={getActiveStep()} />

          {/* Order Summary */}
          <OrderSummaryAdmin
            order={order}
            setVerifyFundButton={setVerifyFundButton}
            setVerifyShippedButton={setVerifyShippedButton}
            refreshOrder={refreshOrder}
          />

          {/* Admin Actions */}
          {admin?.role === "admin" && (
            <>
              {(orderStatus === "Processing" || verifyFundButton) && (
                <AdminVerifyFund
                  id={id}
                  order={order}
                  setOnSuccess={setOnSuccess}
                />
              )}
              {(orderStatus === "Shipped" || verifyShippedButton) && (
                <AdminVerifyDispatch
                  id={id}
                  order={order}
                  setOnSuccess={setOnSuccess}
                />
              )}
              {orderStatus === "Delivered" && order.returnStatus !== "Not" && (
                <AdminReturnOrder
                  id={id}
                  order={order}
                  setOnSuccess={setOnSuccess}
                />
              )}
              {(orderStatus === "Delivered" || orderStatus === "Completed") && (
                <VerifyDelivery
                  id={id}
                  order={order}
                  setOnSuccess={setOnSuccess}
                />
              )}
            </>
          )}

          {/* Product Details */}
          <InquiryCard title="Product Details" singleConversation={order} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailView;
