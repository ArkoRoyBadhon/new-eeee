"use client";
import OrderCard from "@/app/_components/OrderCard";
import PaginationFooter from "@/app/_components/PaginationFooter";
import { orderApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function OrdersList() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { token } = useSelector((state) => state.auth);

  const tabToStatusMap = {
    All: "All",
    Confirming: "Not_Confirm",
    Unpaid: "Pending",
    Delivering: "Delivering",
    "Refunds & after-sales": "Refund",
    "Completed & in review": "Completed",
  };

  const tabs = Object.keys(tabToStatusMap);

  const fetchOrders = async (page = 1) => {
    try {
      if (token) {
        setIsLoading(true);
        const status = tabToStatusMap[selectedTab];
        const response = await orderApi.getOrders(
          token,
          status,
          page,
          itemsPerPage
        );
        setOrders(response?.orders || []);
        setOrderStats(response || {});
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [token, selectedTab, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="my-6">
      <div className="w-full p-6 bg-[#FDF5E5] rounded-[16px] shadow-lg">
        <h1 className="mb-4 text-lg font-bold">Orders</h1>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-[15px] leading-[150%] tracking-[-1%] cursor-pointer whitespace-nowrap ${
                selectedTab === tab
                  ? "bg-[#DFB547] font-bold"
                  : "hover:bg-[#DFB547] border-[#DFB547]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p>Loading orders...</p>
          </div>
        ) : orders.length <= 0 ? (
          <div className="flex justify-center items-center text-[#555555] text-[20px] leading-[150%] tracking-[-1%] font-bold min-h-[300px]">
            {selectedTab === "All"
              ? "No orders yet"
              : `No ${selectedTab.toLowerCase()} orders yet`}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {orders.map((order) => (
                <OrderCard order={order} />
              ))}
            </div>

            {orderStats?.totalDoc && (
              <div className="mt-6">
                <PaginationFooter
                  totalItems={orderStats?.totalDoc}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
