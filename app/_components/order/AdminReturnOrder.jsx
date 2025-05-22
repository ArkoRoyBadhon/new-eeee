import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Truck,
  XCircle,
  PackageCheck,
  PackageX,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { handleDownload } from "@/utils/fileDownloader";

const AdminReturnOrder = ({ order, onStatusUpdate, setOnSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const { token } = useSelector((state) => state.admin);

  const handleApproveReturn = async () => {
    try {
      setIsProcessing(true);
      const response = await orderApi.updateOrderAdmin(
        order._id,
        {
          status: "Delivered",
          adminNotes,
          returnStatus: "Approved",
          returnRejectedAt: new Date().toISOString(),
        },
        token
      );
      toast.success("Return request approved successfully!");
      setOnSuccess(true);
      // onStatusUpdate("Delivered");
      setShowApproveDialog(false);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to approve return");
    } finally {
      setIsProcessing(false);
      setAdminNotes("");
    }
  };

  const handleRejectReturn = async () => {
    try {
      setIsProcessing(true);
      const response = await orderApi.updateOrderAdmin(
        order._id,
        {
          status: "Delivered",
          adminNotes,
          returnStatus: "Rejected",
          returnRejectedAt: new Date().toISOString(),
        },
        token
      );
      toast.success("Return request rejected!");
      // onStatusUpdate("Delivered");
      setOnSuccess(true);
      setShowRejectDialog(false);
      setAdminNotes("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject return");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteReturn = async () => {
    try {
      setIsProcessing(true);
      await orderApi.updateOrderAdmin(
        order._id,
        {
          status: "Delivered",
          adminNotes,
          returnStatus: "Approved",
          returnRejectedAt: new Date().toISOString(),
        },
        token
      );
      toast.success("Return process completed!");
      // onStatusUpdate("Delivered");
      setOnSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete return");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-[#fdf5e5] border border-gray-200">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-[#DFB547]" />
          <h3 className="text-[#1E293B] font-medium">Return Request</h3>
          {order.returnStatus === "Pending" && (
            <Badge
              variant="outline"
              className="ml-auto bg-yellow-50 text-yellow-600"
            >
              Pending Review
            </Badge>
          )}
          {order.returnStatus === "Approved" && (
            <Badge className="ml-auto bg-green-50 text-green-600">
              <PackageCheck className="h-3 w-3 mr-1" />
              Approved
            </Badge>
          )}
          {order.returnStatus === "Rejected" && (
            <Badge className="ml-auto bg-red-50 text-red-600">
              <PackageX className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-6">
          {/* Return Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">Request Date</Label>
              <p className="font-medium">
                {order.returnRequestedAt
                  ? new Date(order.returnRequestedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">Reason</Label>
              <p className="font-medium">{order.returnReason || "N/A"}</p>
            </div>
          </div>

          {/* Return Proof */}
          <div className="flex flex-wrap gap-2 mb-4">
            {order.returnProofUrls?.length ? (
              order.returnProofUrls.map((url, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 text-gray-700 hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 text-[#DFB547]" />
                      {`Proof ${index + 1}`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => window.open(url, "_blank")}
                      className="bg-white"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Proof
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="bg-white"
                      onClick={() =>
                        handleDownload(
                          url,
                          `${`Document ${index + 1}`.replace(/\s+/g, "_")}.${url
                            .split(".")
                            .pop()}`
                        )
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No return proofs available
              </p>
            )}
          </div>

          {/* Admin Actions */}
          {order.returnStatus === "Pending" && (
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                onClick={() => setShowApproveDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve Return
              </Button>
              <Button
                onClick={() => setShowRejectDialog(true)}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Return
              </Button>
            </div>
          )}

          {order.status === "ReturnApproved" && (
            <div className="pt-4">
              <Button
                onClick={handleCompleteReturn}
                disabled={isProcessing}
                className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Truck className="h-4 w-4 mr-2" />
                )}
                Mark as Returned
              </Button>
            </div>
          )}

          {/* Admin Notes */}
          {(order.status === "ReturnApproved" ||
            order.status === "ReturnRejected") &&
            order.adminNotes && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Admin Notes</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{order.adminNotes}</p>
                </div>
              </div>
            )}
        </div>

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Approve Return Request</DialogTitle>
              <DialogDescription>
                This will approve the return and provide instructions to the
                buyer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="adminNotes">Instructions (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Provide return instructions or notes for the buyer..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApproveReturn}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Approve Return
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reject Return Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this return request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason*</Label>
                <Textarea
                  id="rejectReason"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Explain why this return request is being rejected..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectReturn}
                disabled={isProcessing || !adminNotes.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject Return
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminReturnOrder;
