"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Step5Policies = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <>
      <CardHeader className="px-0 mb-2">
        <CardTitle className="text-2xl font-bold">Policies & Agreements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4">
        <h2 className="text-[18px] font-semibold">Terms of Service & Privacy Policy</h2>
        <div className="space-y-4">
          {[
            {
              id: "policies.terms",
              label: "I agree to the platform’s Terms of Service and conditions",
            },
            {
              id: "policies.privacy",
              label: "I agree to the platform’s Privacy Policy and conditions",
            },
            {
              id: "policies.conditions",
              label: "I agree to the platform’s terms and conditions",
            },
            {
              id: "policies.authentic",
              label: "I confirm all provided documents are authentic",
            },
          ].map((policy) => (
            <div key={policy.id}>
              <div className="flex items-start space-x-3 transition-colors">
                <Checkbox
                  id={policy.id}
                  checked={watch(policy.id) || false}
                  onCheckedChange={(checked) =>
                    register(policy.id).onChange({
                      target: { name: policy.id, value: checked },
                    })
                  }
                  className="mt-1 size-4.5 border-gray-300 
                    data-[state=checked]:bg-[#DFB547] 
                    data-[state=checked]:border-[#DFB547] 
                    data-[state=checked]:text-white"
                />
                <Label htmlFor={policy.id} className="leading-relaxed">
                  {policy.label}
                </Label>
              </div>
              {errors.policies?.[policy.id.split(".")[1]] && (
                <p className="text-red-500 text-[12px] mt-1 pl-8">
                  {errors.policies[policy.id.split(".")[1]].message}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default Step5Policies;