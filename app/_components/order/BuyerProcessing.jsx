import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import React from "react";

const BuyerProcessing = ({ order }) => {
  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6">
        {order?.payStatus === "Pending" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Pending Icon */}
            <CircleDollarSign className="h-12 w-12 text-yellow-500 animate-bounce" />
            {/* Pending Text */}
            <h3 className="text-[#555555] font-medium text-lg">
              Payment Pending (Off Platform Payment)
            </h3>
            <h4 className="text-[#555555] font-medium text-[20px]">
              Your order is processing
            </h4>
            <p className="text-sm text-[#555555]">
              Your payment is currently pending. Once you received the the
              product then need to pay.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="text-[#555555] font-medium">
                  Payment Received ({order?.paymentTerms?.upfront}%)
                </h3>
                <p className="text-sm text-[#555555] mt-1">
                  Thank you for your partial payment! Your order is now being
                  processed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Payment Progress</span>
                <span className="font-medium">
                  {order?.paymentTerms?.upfront}% completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#DFB547] h-2.5 rounded-full"
                  style={{ width: order?.paymentTerms?.upfront + "%" }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-[#555555]">
              <p>
                Remaining balance:{" "}
                <span className="font-medium">
                  $
                  {(
                    order.total -
                    order.total * (order?.paymentTerms?.upfront / 100)
                  ).toFixed(2)}
                </span>
              </p>
              <p className="mt-1">
                Next payment due:{" "}
                {new Date(
                  order?.paymentTerms?.milestones[0]?.days || order?.deliverTime
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuyerProcessing;
