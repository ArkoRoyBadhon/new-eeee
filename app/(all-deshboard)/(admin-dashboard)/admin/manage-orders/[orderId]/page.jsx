import React from "react";
import OrderDetailView from "./_components/OrderDetailView";

const page = async ({ params }) => {
  const { orderId } = await params;
  return <OrderDetailView id={orderId} />;
};

export default page;
