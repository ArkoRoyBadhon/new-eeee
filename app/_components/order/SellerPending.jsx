import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const SellerPending = () => {
  return (
    <Card className="bg-[#FDF5E5] border-none">
      <CardContent className="p-6">
        <h3 className="font-medium mb-2 text-[#555555]">
          Waiting for 30% upfront payment
        </h3>
        <p className="text-[12px] leading-[150%] tracking-[-1%] text-[#555555]">
          **Buyer pay 30% of total Cost as deposit. Rest will be paid on
          delivery**
        </p>
      </CardContent>
    </Card>
  );
};

export default SellerPending;
