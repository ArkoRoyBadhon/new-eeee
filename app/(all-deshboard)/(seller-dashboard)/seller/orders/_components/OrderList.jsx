"use client";
import OrderCard from "@/app/_components/OrderCard";
import PaginationFooter from "@/app/_components/PaginationFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const response = await orderApi.getOrders(token);
          const { orders: orderData, ...rest } = response;
          setOrders(orderData || []);
          setOrderStats(rest);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    })();
  }, [token]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-40 animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          All Orders ({orders.length || 0})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders?.length > 0 ? (
          orders.map((order) => <OrderCard order={order} />)
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No orders found</p>
            <Link href="/products">
              <Button variant="link" className="mt-2">
                Browse Products
              </Button>
            </Link>
          </div>
        )}
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
    </div>
  );
};

export default OrderList;
