import React from "react";

const OrderProgressTracker = ({ activeStep }) => {
  const steps = ["Order", "Payment", "Dispatch", "Delivery", "Review"];

  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < activeStep
                  ? "bg-[#DFB547] text-white"
                  : index === activeStep
                  ? "bg-[#FDF5E5] text-[#555555]"
                  : "bg-white text-gray-500"
              } shadow-lg h-[46px] w-[46px]`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-2">{step}</span>
          </div>
        ))}
      </div>

      {/* Connecting lines */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2 z-0">
        <div
          className="h-full bg-[#DFB547] transition-all duration-300"
          style={{
            width: `${
              ((activeStep === steps.length ? activeStep - 1 : activeStep) /
                (steps.length - 1)) *
              100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default OrderProgressTracker;
