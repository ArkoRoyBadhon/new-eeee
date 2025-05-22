import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  PackageCheck,
  FileText,
  CheckCircle2,
  Loader2,
  Eye,
  Download,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orderApi } from "@/lib/api";
import { useSelector } from "react-redux";

const VerifyDelivery = ({ id, order, setOnSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProof, setCurrentProof] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { token } = useSelector((state) => state.admin);

  const handleReleaseFunds = async () => {
    try {
      setIsProcessing(true);
      const response = await orderApi.updateOrderAdmin(
        id,
        {
          status: "Completed",
          fundsReleased: true,
          fundsReleasedAt: new Date().toISOString(),
        },
        token
      );

      toast.success("Funds released to seller successfully!");
      setOnSuccess(response);
    } catch (error) {
      toast.error("Failed to release funds");
      console.error(error);
    } finally {
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };

  const handleDownload = (url, filename) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename || url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        window.open(url, "_blank");
      });
  };

  return (
    <Card className="bg-[#fdf5e5] border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <PackageCheck className="h-5 w-5 text-[#DFB547]" />
          <h3 className="text-[#111827] font-medium">
            Delivery Verification & Fund Release
          </h3>
          {order.fundsReleased ? (
            <Badge className="ml-auto bg-green-100 text-green-800">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Funds Released
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto">
              Pending Release
            </Badge>
          )}
        </div>

        {order.deliveryProof && order.deliveryProof.length > 0 ? (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-[#555555] mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Delivery Proof
            </h4>

            <div className="flex flex-wrap gap-2 mb-4">
              {order.deliveryProof.map((proof, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 text-gray-700 hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 text-[#DFB547]" />
                      Proof {index + 1}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => window.open(proof, "_blank")}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Document
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownload(
                          proof,
                          `Proof_${index + 1}.${proof.split(".").pop()}`
                        )
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>

            {!order.fundsReleased && (
              <>
                {order.status === "Completed" ? (
                  <Button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isProcessing}
                    className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Release Funds
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={true}
                    className="bg-[#DFB547]/50 text-white"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Release Funds
                  </Button>
                )}

                <Dialog
                  open={showConfirmModal}
                  onOpenChange={setShowConfirmModal}
                >
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Fund Release</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        Are you sure you want to release {order.totalAmount} to
                        the seller?
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This action cannot be undone.
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
                        onClick={handleReleaseFunds}
                        disabled={isProcessing}
                        className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <DollarSign className="mr-2 h-4 w-4" />
                        )}
                        Confirm Release
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Waiting for delivery proof to be uploaded
          </p>
        )}

        {/* Full Document Viewer Dialog */}
        {currentProof && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[#555555]">
                Open Document Viewer
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[40vw] h-[90vh] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl">Delivery Proof</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-100px)] w-full">
                <div className="space-y-6 p-2">
                  <div className="rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Proof Viewer</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(currentProof, "_blank")}
                        className="text-[#4F46E5] border-[#DFB547] hover:bg-[#4F46E5]/10"
                      >
                        Open Fullscreen
                      </Button>
                    </div>
                    <div className="relative w-full h-[70vh] bg-gray-50 rounded-lg overflow-hidden border">
                      {currentProof.match(/\.(jpeg|jpg|gif|png)$/) ? (
                        <img
                          src={currentProof}
                          alt="Delivery Proof"
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <iframe
                          src={currentProof}
                          title="Delivery Proof"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyDelivery;
