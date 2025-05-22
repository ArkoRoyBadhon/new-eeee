"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function PaymentTerms({ onSubmit }) {
  const [upfront, setUpfront] = useState("");
  const [onDelivery, setOnDelivery] = useState("");
  const [milestones, setMilestones] = useState([]);

  const addMilestone = () =>
    setMilestones([...milestones, { percentage: "", days: "" }]);
  const removeMilestone = (index) =>
    setMilestones(milestones.filter((_, i) => i !== index));

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const calculateTotal = () => {
    const upfrontValue = parseFloat(upfront || "0");
    const deliveryValue = parseFloat(onDelivery || "0");
    const milestonesValue = milestones.reduce(
      (sum, m) => sum + parseFloat(m.percentage || "0"),
      0
    );
    return upfrontValue + deliveryValue + milestonesValue;
  };

  const handleSubmit = () => {
    const total = calculateTotal();
    if (total !== 100) {
      toast.error(`Total must be 100% (Current: ${total}%)`);
      return;
    }

    const paymentData = { upfront, onDelivery, milestones };
    onSubmit?.(paymentData);
    toast.success("Payment terms saved!");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Upfront (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={upfront}
            onChange={(e) => setUpfront(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label>On Delivery (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={onDelivery}
            onChange={(e) => setOnDelivery(e.target.value)}
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

      {milestones.length > 0 && (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
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

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="font-medium">
          Total:{" "}
          <span
            className={
              calculateTotal() === 100 ? "text-green-600" : "text-red-600"
            }
          >
            {calculateTotal()}%
          </span>
        </div>
        {calculateTotal() === 100 && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Valid
          </div>
        )}
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
}
