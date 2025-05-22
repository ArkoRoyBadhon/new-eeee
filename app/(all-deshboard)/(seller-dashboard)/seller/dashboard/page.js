import React from "react";
import Dashboard from "../_components/dashboard/Dashboard";
import Message from "../_components/dashboard/Message";
import { MessageCircle } from "lucide-react";
import { MdPerson, MdRequestQuote } from "react-icons/md";
import OrderRequestsCard from "./_components/OrderRequestsCard";

export const metadata = {
  title: "Dashboard | King Mansa",
};

const SellerDashboard = () => {
  const ToDoListData = [
    {
      _id: 1,
      title: "Unread Message",
      count: 2,
      icon: MessageCircle,
    },
    {
      _id: 2,
      title: "New Customer",
      count: 2,
      icon: MdPerson,
    },
    {
      _id: 3,
      title: "New RFQ",
      count: 2,
      icon: MdRequestQuote,
    },
    {
      _id: 4,
      title: "Inquiries",
      count: 2,
      icon: MessageCircle,
    },
    {
      _id: 5,
      title: "Product listing",
      count: 7,
      icon: MessageCircle,
    },
    {
      _id: 6,
      title: "Pending order",
      count: 2,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="container mx-auto p-6 min-h-screen space-y-6">
      <Dashboard />
      <Message />
      <OrderRequestsCard />
    </div>
  );
};

export default SellerDashboard;
