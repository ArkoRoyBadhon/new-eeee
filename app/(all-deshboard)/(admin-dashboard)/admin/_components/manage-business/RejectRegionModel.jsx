import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const RejectRegionModel = ({ open, onClose, onReject }) => {
  const [rejectionReasons, setRejectionReasons] = useState([]);

  const fields = [
    { id: "storeLogo", label: "Store Logo" },
    { id: "businessRegistration", label: "Business Registration" },
    { id: "taxId", label: "Tax ID" },
    { id: "proofOfAddress", label: "Proof of Address" },
    { id: "ownerIdentification", label: "Owner Identification" },
    { id: "storeName", label: "Store Name" },
    { id: "businessEmail", label: "Business Email" },
    { id: "phoneNumber", label: "Phone Number" },
    // Add more fields as needed
  ];

  const handleCheckboxChange = (fieldId, checked) => {
    if (checked) {
      setRejectionReasons((prev) => [
        ...prev,
        { field: fieldId, reason: "" },
      ]);
    } else {
      setRejectionReasons((prev) =>
        prev.filter((item) => item.field !== fieldId)
      );
    }
  };

  const handleReasonChange = (fieldId, value) => {
    setRejectionReasons((prev) =>
      prev.map((item) =>
        item.field === fieldId ? { ...item, reason: value } : item
      )
    );
  };

  const handleSubmit = () => {
    if (rejectionReasons.length === 0) {
      alert("Please select at least one field to reject.");
      return;
    }
    if (rejectionReasons.some((item) => !item.reason.trim())) {
      alert("Please provide a reason for each selected field.");
      return;
    }
    onReject(rejectionReasons);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Rejection Reasons</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(field.id, checked)
                  }
                />
                <Label htmlFor={field.id}>{field.label}</Label>
              </div>
              {rejectionReasons.some((item) => item.field === field.id) && (
                <Input
                  placeholder={`Reason for rejecting ${field.label}`}
                  onChange={(e) => handleReasonChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectRegionModel;