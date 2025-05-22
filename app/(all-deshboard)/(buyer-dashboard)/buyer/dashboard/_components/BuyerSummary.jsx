"use client";

import ToDoCard from "@/app/(all-deshboard)/(seller-dashboard)/seller/dashboard/_components/ToDoCard";
import { MessageCircle } from "lucide-react";
import { MdChecklist, MdOutlineListAlt, MdRequestQuote } from "react-icons/md";
import OrdersList from "./BuyerOrders";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const BuyerSummary = () => {
  const [orderStats, setOrderStats] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const ToDoListData = [
    {
      _id: 1,
      title: "Unread Message",
      count: 2,
      icon: MessageCircle,
    },
    {
      _id: 2,
      title: "Total Orders",
      count: orderStats?.totalOrders,
      icon: MdOutlineListAlt,
    },
    {
      _id: 3,
      title: "Processing Orders",
      count: orderStats?.processingOrders,
      icon: MdRequestQuote,
    },
    {
      _id: 4,
      title: "Complete Orders",
      count: orderStats?.completeOrders,
      icon: MdChecklist,
    },
  ];

  const fetchBuyerDashboardStats = async () => {
    try {
      const response = await orderApi.getBuyerDashboardStats(token);
      console.log("buyer dashboard stats", response);
      setOrderStats(response?.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchBuyerDashboardStats();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {ToDoListData.map((item, i) => (
          <ToDoCard key={i} item={item} />
        ))}
      </div>
      <OrdersList />
    </div>
  );
};

export default BuyerSummary;
