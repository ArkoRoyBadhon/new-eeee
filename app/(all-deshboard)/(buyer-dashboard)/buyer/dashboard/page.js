import React from "react";
import BuyerSummary from "./_components/BuyerSummary";

export const metadata = {
  title: "Dashboard | King Mansa",
};

const BuyerDashboard = () => {
  return (
    <div className="container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 min-h-screen">
      <BuyerSummary />
    </div>
  );
};

export default BuyerDashboard;
