import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import ViewDetails from "./ViewDetails";
import RejectRegionModel from "./RejectRegionModel";

const ManageCatalog = ({ catalog, onStatusUpdate }) => {
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleReject = (rejectionReasons) => {
    onStatusUpdate(catalog._id, "rejected", rejectionReasons);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{catalog.catalogName || "N/A"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Seller Email:</strong> {catalog.sellerId?.email || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> <span className="capitalize">{catalog.status}</span>
        </p>
        <p>
          <strong>Upload Date:</strong>{" "}
          {catalog.createdAt ? format(new Date(catalog.createdAt), "PPP") : "N/A"}
        </p>
        <div className="flex gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelectedCatalog(catalog)}>
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Catalog Details</DialogTitle>
              </DialogHeader>
              <ViewDetails catalog={selectedCatalog} />
            </DialogContent>
          </Dialog>
          {catalog.status === "pending" && (
            <>
              <Button
                onClick={() => onStatusUpdate(catalog._id, "approved")}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Approve
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Reject
              </Button>
              <RejectRegionModel
                open={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onReject={handleReject}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageCatalog;