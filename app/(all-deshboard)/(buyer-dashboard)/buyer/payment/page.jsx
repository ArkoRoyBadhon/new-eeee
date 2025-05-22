import React from "react";
import PaymentDetail from "../../../../_components/order/PaymentDetail";
import SummaryCard from "../../../../_components/order/SummaryCard";

const page = () => {
  return (
    <div className="min-h-[80vh] flex justify-center items-center py-10">
      <div className="flex gap-4">
        <div className="custom-shadow">
          <PaymentDetail />
        </div>
        <div className="custom-shadow h-fit">
          <SummaryCard />
        </div>
      </div>
    </div>
  );
};

export default page;
