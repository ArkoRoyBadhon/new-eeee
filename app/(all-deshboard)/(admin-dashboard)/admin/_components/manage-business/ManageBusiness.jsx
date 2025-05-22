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

const ManageBusiness = ({ store, onStatusUpdate }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleReject = (rejectionReasons) => {
    onStatusUpdate(store._id, "rejected", rejectionReasons);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{store.storeName || "N/A"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Seller Email:</strong> {store.sellerId?.email || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> <span className="capitalize">{store.status}</span>
        </p>
        <p>
          <strong>Upload Date:</strong>{" "}
          {store.createdAt ? format(new Date(store.createdAt), "PPP") : "N/A"}
        </p>
        <div className="flex gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelectedStore(store)}>
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Store Details</DialogTitle>
              </DialogHeader>
              <ViewDetails store={selectedStore} />
            </DialogContent>
          </Dialog>
          {store.status === "pending" && (
            <>
              <Button
                onClick={() => onStatusUpdate(store._id, "approved")}
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

export default ManageBusiness;