"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const OrderCard = ({ order }) => {
  const router = useRouter();
  return (
    <Card
      key={order._id}
      onClick={() => router.push(`/seller/orders/${order._id}`)}
      className="cursor-pointer custom-shadow p-0 overflow-hidden h-[356px] xl:h-[380px]"
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
          <Badge className="bg-[#DFB547] text-white">{order.status}</Badge>
        </div>
      </div>

      <CardContent>
        <div className="pb-2">
          <div>
            <p className="font-medium">{order.product?.title || "N/A"}</p>
          </div>
          <p className="text-sm text-gray-500">
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Quantity</p>
            <p className="font-medium">{order.quantity}</p>
          </div>
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
  );
};

export default OrderCard;
