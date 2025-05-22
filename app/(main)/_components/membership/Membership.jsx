"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown } from "lucide-react";
import watermarkImg from "../../../../public/assets/watermark.png";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { requestSubscription } from "@/lib/store/slices/subscriptionSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const features = [
  "Access to basic product catalog",
  "Standard order processing",
  "Basic supplier dashboard",
  "Monthly sales reports",
  "Up to 50 product listings",
];

const premiumFeatures = [
  "Unlimited product listings",
  "Priority order processing",
  "24/7 phone support",
  "Real-time inventory sync",
  "Early access to new buyers",
  "Dedicated account manager",
];

export default function Membership() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, selectedRole } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.subscriptions);

  const handleSubscriptionRequest = async (plan) => {
    if (!token || selectedRole !== "seller") {
      toast.error("Please log in as a seller to request a subscription.");
      router.push("/login");
      return;
    }

    try {
      const result = await dispatch(requestSubscription(plan)).unwrap();
      toast.success(result.message);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="px-5 md:px-10 lg:px-20 2xl:px-8 my-[100px]">
        <h2 className="text-[36px] font-bold text-center">
          Flexible plans that grow with you
        </h2>
        <p className="text-[24px] font-bold text-center mt-[24px]">
          With 0% commission fees
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          {/* Free Membership Card */}
          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-[#106CD0]">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-[#106CD0]">Free</h3>
                <p className="text-muted-foreground mt-2">
                  Perfect for getting started
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-[#106CD0]">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-[#106CD0] mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="outline"
                className="mt-8 w-full py-6 text-lg font-medium border-[#106CD0] text-[#106CD0] hover:bg-[#106CD0] hover:text-white"
                onClick={() => handleSubscriptionRequest("free")}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Processing..." : "Try 1 Month Free"}
              </Button>
            </div>
          </div>

          {/* Paid Membership Card */}
          <div className="border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-[#DFB547] relative bg-white">
            <div className="absolute top-0 right-0 bg-[#DFB547] text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium flex items-center">
              <Crown className="h-4 w-4 mr-1" />
              Popular
            </div>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-[#DFB547]">Premium</h3>
                <p className="text-muted-foreground mt-2">
                  Best for power users
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-[#DFB547]">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-[#DFB547] mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="mt-8 w-full py-6 text-lg font-medium bg-[#DFB547] hover:bg-[#DFB547]/90"
                onClick={() => handleSubscriptionRequest("premium")}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Processing..." : "Get Premium"}
              </Button>
            </div>
            <div className="absolute -top-44 -right-40 -z-1 lg:block hidden">
              <Image src={watermarkImg} alt="Logo" width={300} height={300} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}