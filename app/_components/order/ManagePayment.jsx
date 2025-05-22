"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import React, { useState } from "react";
import PaymentDetail from "./PaymentDetail";
import SummaryCard from "./SummaryCard";
import { orderApi } from "@/lib/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ManagePayment = ({ id, order, setOrderStatus }) => {
  const [selectPayment, setSelectPayment] = useState(null);
  const [showOffPlatformForm, setShowOffPlatformForm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleBack = () => {
    setSelectPayment(null);
    setShowOffPlatformForm(false);
    setAgreeTerms(false);
  };

  const orderApiFunc = async () => {
    console.log("Processing payment... off platform");

    try {
      const response = await orderApi.updateOrder(
        id,
        {
          status: "Processing",
          paymentMethod: "OffPlatform",
          payStatus: "Pending",
        },
        token
      );
      setOrderStatus(response.status);
      setShowOffPlatformForm(true);
      toast.success("Continued with Off Platform Payment!");
    } catch (error) {
      toast.error("Payment failed!");
    }
  };

  return (
    <div className="">
      {!selectPayment ? (
        <>
          <h1 className="text-[18px] font-bold mb-2 custom-text">
            Choose Payment Option
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Platform Payments Card */}
            <div className="flex-1 bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-[#FDF5E5] px-6 py-4">
                <h2 className="text-[16px] text-[#555555] font-semibold h-[20px]">
                  Platform Payments
                </h2>
              </div>
              <div className="p-6 flex flex-col justify-between h-[calc(100%-50px)]">
                <p className="text-[14px] custom-text text-[#555555] mb-4">
                  Manage all payments processed through our platform. View
                  transaction history, issue refunds, and track payment status.
                </p>

                <Button
                  variant="outline"
                  className="hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
                  onClick={() => setSelectPayment("platform")}
                >
                  Select
                </Button>
              </div>
            </div>

            {/* Off-Platform Payments Card */}
            <div className="flex-1 bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-[#FDF5E5] px-6 py-4">
                <h2 className="text-[16px] text-[#555555] font-semibold h-[20px]">
                  Off-Platform Payments
                </h2>
              </div>
              <div className="p-6 flex flex-col justify-between h-[calc(100%-50px)]">
                <p className="text-[14px] custom-text text-[#555555] mb-4">
                  Record and track payments made outside our platform. Manually
                  add transactions to keep all records in one place.
                </p>
                <Button
                  variant="outline"
                  className="hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
                  onClick={() => setSelectPayment("off-platform")}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-1 text-[#555555] hover:bg-[#FDF5E5]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Payment Options
            </Button>
          </div>

          {selectPayment === "platform" && (
            <>
              <div className="w-full flex gap-4 mt-4">
                <div className="custom-shadow flex-1">
                  <PaymentDetail
                    id={id}
                    order={order}
                    setOrderStatus={setOrderStatus}
                  />
                </div>
                <div className="custom-shadow h-fit flex-1">
                  <SummaryCard order={order} />
                </div>
              </div>
              <p className="text-[12px] leading-[150%] tracking-[-1%] text-[rgb(85,85,85)] pt-2">
                **You Need to pay 30% of total Cost as deposit. Rest will be
                paid on delivery**
              </p>
            </>
          )}

          {selectPayment === "off-platform" && !showOffPlatformForm && (
            <div className="w-full bg-white rounded-lg p-6 mt-4">
              <h2 className="text-lg font-semibold mb-4">Important Notice</h2>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-yellow-700 font-medium">
                    ⚠️ Payment Risk Warning
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Our platform is not liable for any transactions made outside
                    our payment system.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Terms & Conditions:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li>All off-platform payments must be verified manually</li>
                    <li>Payment proofs must be submitted within 24 hours</li>
                    <li>Transaction fees may apply for payment verification</li>
                    <li>
                      Order processing will only begin after payment
                      confirmation
                    </li>
                    <li>
                      Disputes must be resolved directly with the recipient
                    </li>
                  </ul>
                </div>

                <div className="flex items-start mt-4">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                    I understand and accept the risks associated with
                    off-platform payments
                  </label>
                </div>
              </div>

              <Button
                className="bg-[#DFB547] hover:bg-[#C9A03D] text-white rounded-[55px] px-6 py-2"
                disabled={!agreeTerms}
                onClick={() => orderApiFunc()}
              >
                Continue to Payment Details
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagePayment;
