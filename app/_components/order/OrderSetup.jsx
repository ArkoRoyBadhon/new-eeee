"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { DatePicker } from "./DatePicker";
import { toast } from "sonner";
import { orderApi } from "@/lib/api";

const OrderSetup = ({
  setupData,
  setSetupData,
  setShowSetupForm,
  setShowSetupConfirmation,
}) => {
  const [paymentTerms, setPaymentTerms] = useState({
    upfront: "",
    onDelivery: "",
    milestones: [],
  });

  const calculatePaymentTotal = () => {
    const upfrontValue = parseFloat(paymentTerms.upfront || "0");
    const deliveryValue = parseFloat(paymentTerms.onDelivery || "0");
    const milestonesValue = paymentTerms.milestones.reduce(
      (sum, m) => sum + parseFloat(m.percentage || "0"),
      0
    );
    return upfrontValue + deliveryValue + milestonesValue;
  };

  const handleSetupComplete = async () => {
    if (!setupData.deliverTime) {
      toast.warning("Please select a delivery date");
      return;
    }

    const hasPaymentTerms =
      paymentTerms.upfront ||
      paymentTerms.onDelivery ||
      paymentTerms.milestones.length > 0;

    if (hasPaymentTerms && calculatePaymentTotal() !== 100) {
      toast.error("Payment terms must total 100%");
      return;
    }

    setSetupData({ ...setupData, paymentTerms });

    // console.log("Setup Data: ssss", { ...setupData, paymentTerms });
    setShowSetupConfirmation(true);
  };

  const addMilestone = () => {
    setPaymentTerms({
      ...paymentTerms,
      milestones: [...paymentTerms.milestones, { percentage: "", days: "" }],
    });
  };

  const removeMilestone = (index) => {
    setPaymentTerms({
      ...paymentTerms,
      milestones: paymentTerms.milestones.filter((_, i) => i !== index),
    });
  };

  const updateMilestone = (index, field, value) => {
    if (field === "percentage" && value !== "") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      if (numValue < 0 || numValue > 100) return;
    }

    const updated = [...paymentTerms.milestones];
    updated[index][field] = value;
    setPaymentTerms({ ...paymentTerms, milestones: updated });
  };

  const handlePaymentTermsChange = (field, value) => {
    if (value !== "") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      if (numValue < 0 || numValue > 100) return;
    }

    setPaymentTerms({
      ...paymentTerms,
      [field]: value,
    });
  };

  return (
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSetupForm(false)}
          className="text-[#DFB547] hover:bg-[#DFB547]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Order Actions
        </Button>
      </div>
      <div>
        <Label htmlFor="setupDeliverTime" className="pb-1">
          Estimated Delivery Date
        </Label>
        <DatePicker
          setupData={setupData}
          setSetupData={setSetupData}
          className="mt-1 w-full"
          placeholderText="Select delivery date"
        />
      </div>

      <div className="mt-6 space-y-2">
        <h4 className="font-medium">Payment Terms (Optional)</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Upfront (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={paymentTerms.upfront}
              onChange={(e) =>
                handlePaymentTermsChange("upfront", e.target.value)
              }
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>On Delivery (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={paymentTerms.onDelivery}
              onChange={(e) =>
                handlePaymentTermsChange("onDelivery", e.target.value)
              }
              placeholder="0"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={addMilestone} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        </div>

        {paymentTerms.milestones.length > 0 && (
          <div className="space-y-3">
            {paymentTerms.milestones.map((milestone, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
              >
                <div className="space-y-2">
                  <Label>Percentage (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={milestone.percentage}
                    onChange={(e) =>
                      updateMilestone(index, "percentage", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Days After Delivery</Label>
                  <Input
                    type="number"
                    min="0"
                    value={milestone.days}
                    onChange={(e) =>
                      updateMilestone(index, "days", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <Button
                  onClick={() => removeMilestone(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => setShowSetupForm(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSetupComplete}
          className="bg-[#DFB547] hover:bg-[#DFB547]/90"
          disabled={!setupData.deliverTime}
        >
          Complete Setup
        </Button>
      </div>
    </CardContent>
  );
};

export default OrderSetup;
