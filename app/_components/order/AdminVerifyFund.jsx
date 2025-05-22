import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";

const AdminVerifyFund = ({ id, order, setOnSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { token } = useSelector((state) => state.admin);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);

      const response = await orderApi.updateOrderAdmin(
        id,
        {
          status: "Processing",
          isVerified: true,
        },
        token
      );

      toast.success("Escrow funds verified successfully!");
      setShowConfirmModal(false);

      setOnSuccess(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to verify escrow funds"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Landmark className="h-5 w-5 text-[#DFB547]" />
          <h3 className="text-[#555555] font-medium">
            Escrow Fund Verification
          </h3>
          {order.isVerified ? (
            <Badge className="ml-auto bg-[#DFB547]/10 text-[#DFB547] hover:bg-[#DFB547]/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto">
              Pending Verification
            </Badge>
          )}
        </div>

        <div className="pt-4 border-t border-[#DFB547]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Escrow Amount</p>
              <p className="font-medium">$ {order.upfrontAmount || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Escrow Service</p>
              <p className="font-medium">
                {order.upfrontAmount * 0.01 || "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Deposit Date</p>
              <p className="font-medium">
                {order.depositDate
                  ? new Date(order?.depositDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[#555555]">Reference Number</p>
              <p className="font-medium">{order._id || "N/A"}</p>
            </div>
          </div>

          {!order.isVerified && (
            <>
              <Button
                onClick={() => setShowConfirmModal(true)}
                disabled={isVerifying}
                className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify Escrow Funds
              </Button>

              <Dialog
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Escrow Verification</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>
                      Are you sure the escrow funds have been properly
                      deposited?
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This confirms the funds are secured in escrow and releases
                      the order for processing.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
                    >
                      {isVerifying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Confirm Verification
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminVerifyFund;
