import React from "react";

const OrderProcessSteps = () => {
  const steps = [
    {
      number: "1",
      title: "Submit order request",
      description: "",
    },
    {
      number: "2",
      title: "Negotiate details with supplier",
      description: "",
    },
    {
      number: "3",
      title: "Receive sample order if necessary",
      description: "",
    },
    {
      number: "4",
      title: "Make payment for bulk order and wait for delivery",
      description: "",
    },
  ];

  const activeStep = 1;

  return (
    <div className="relative pb-8 px-4">
      <div className="flex justify-between w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className={`rounded-full flex items-center justify-center ${
                index + 1 <= activeStep
                  ? "bg-[#DFB547] text-white"
                  : "bg-white text-gray-500"
              } shadow-lg h-[46px] w-[46px]`}
            >
              {step.number}
            </div>
            <span className="text-xs mt-2 text-center absolute bottom-[-70px] w-[100px] h-[60px]">
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Connecting lines */}
      <div className="absolute top-[23px] left-5 right-5 h-0.5 bg-gray-300 -translate-y-1/2 z-0">
        <div
          className="h-full bg-[#DFB547] transition-all duration-300"
          // style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OrderProcessSteps;
