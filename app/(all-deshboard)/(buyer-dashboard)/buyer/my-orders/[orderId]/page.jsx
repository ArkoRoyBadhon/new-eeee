import OrderDetailView from "@/app/_components/order/OrderDetailView";

const page = async ({ params }) => {
  const { orderId } = await params;
  return <OrderDetailView id={orderId} />;
};

export default page;
