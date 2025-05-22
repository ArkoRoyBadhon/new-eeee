"use client";
import InquiryCard from "@/app/_components/InquiryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderRequestsCard = () => {
  const [loading, setLoading] = useState(false);
  const [orderRequests, setOrderRequests] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      try {
        const response = await orderApi.getAllOrderRequestSupplier(token);
        console.log(response);
        setOrderRequests(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Card className="w-full custom-shadow rounded-[16px] p-0 overflow-hidden my-6">
      <CardHeader className="pb-2 bg-[#FDF5E5] py-[16px] px-[24px]">
        <CardTitle className="text-[18px] custom-text font-bold">
          Order Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orderRequests.length > 0 ? (
            orderRequests?.map((item) => (
              <div className="" key={item._id}>
                <InquiryCard
                  headingTitle="Inquiries"
                  singleConversation={item}
                  gateway="supplier"
                />
              </div>
            ))
          ) : (
            <div className="w-full col-span-3 py-5">
              <h1 className="text-center text-[14px] custom-text font-bold text-[#555555]/80">
                No Order Request
              </h1>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderRequestsCard;
