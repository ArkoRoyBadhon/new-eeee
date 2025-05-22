"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderApi } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const token = useSelector((state) => state.admin.token);

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          // const response = await orderApi.getAllOrder(token);
          const response = await orderApi.getOrdersAdmin(token);
          console.log("response", response);

          setOrders(response?.orders || []);
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
              <CardContent className="h-40"></CardContent>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order._id}
              onClick={() => router.push(`/admin/manage-orders/${order._id}`)}
              className="cursor-pointer custom-shadow bg-[#FDF5E5] p-0 overflow-hidden h-[356px]"
            >
              <div className="relative h-[160px] bg-stone-100 flex items-center justify-center cursor-pointer">
                <Image
                  src={order?.product?.image[0] || "/placeholder.svg"}
                  alt={order?.product?.title || "Product"}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#FDF5E5] text-[#DFB547]">
                    {order?.status}
                  </Badge>
                </div>
              </div>

              <CardContent>
                <div className="pb-2">
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium">
                      {order.product?.title || "N/A"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-medium">${order.total}</p>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-[#DFB547] hover:bg-[#DFB547] hover:text-[#ffffffe2]"
                      onClick={() => {
                        router.push(`/admin/manage-orders/${order?._id}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
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
    </div>
  );
};

export default OrderListAdmin;
