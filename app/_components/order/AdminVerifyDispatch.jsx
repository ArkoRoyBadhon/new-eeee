import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  FileText,
  CheckCircle2,
  Loader2,
  Eye,
  Download,
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
import { handleDownload } from "@/utils/fileDownloader";

const AdminVerifyDispatch = ({ id, order, setOnSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { token } = useSelector((state) => state.admin);
  const handleVerify = async () => {
    console.log("Verifying dispatch...");

    try {
      setIsVerifying(true);

      const response = await orderApi.updateOrderAdmin(
        id,
        { status: "Shipped", isDispatch: true },
        token
      );

      toast.success("Dispatch verified successfully!");
      setOnSuccess(response.status);
      setShowConfirmModal(false);
    } catch (error) {
      toast.error("Failed to verify dispatch");
    } finally {
      setIsVerifying(false);
    }
  };

 

  useEffect(() => {}, [showConfirmModal]);

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-[#DFB547]" />
          <h3 className="text-[#555555] font-medium">
            Order Dispatch Verification
          </h3>
          {order.isDispatch ? (
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

        {order.dispatchDocuments?.length > 0 ? (
          <div className="pt-4 border-t border-[#DFB547]/20">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dispatch Documents
            </h4>

            <div className="flex flex-wrap gap-2 mb-4">
              {order.dispatchDocuments?.length ? (
                order.dispatchDocuments.map((doc, index) => (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="h-4 w-4 text-[#DFB547]" />
                        {`Document ${index + 1}`}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => window.open(doc, "_blank")}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Document
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleDownload(
                            doc,
                            `${`Document ${index + 1}`.replace(
                              /\s+/g,
                              "_"
                            )}.${doc.split(".").pop()}`
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
                  No dispatch documents available
                </p>
              )}
            </div>

            {!order.isDispatch && (
              <>
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!order.dispatchDocuments?.length || isVerifying}
                  className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Verified
                </Button>

                <Dialog
                  open={showConfirmModal}
                  onOpenChange={setShowConfirmModal}
                >
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Verification</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        Are you sure you want to mark this dispatch as verified?
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
        ) : (
          <p className="">Please wait to seller upload dispatch documents</p>
        )}

        {/* Full Document Viewer Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-[#DFB547]">
              Open Document Viewer
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[40vw] h-[90vh] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">Dispatch Documents</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-100px)] w-full">
              {order.dispatchDocuments?.length > 0 ? (
                <div className="space-y-6 p-2">
                  {order.dispatchDocuments.map((doc, index) => (
                    <div key={index} className="rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{`Document ${
                          index + 1
                        }`}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc, "_blank")}
                          className="text-[#DFB547] border-[#DFB547] hover:bg-[#DFB547]/10"
                        >
                          Open Fullscreen
                        </Button>
                      </div>
                      <div className="relative w-full h-[70vh] bg-gray-50 rounded-lg overflow-hidden border">
                        {doc.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <img
                            src={doc}
                            alt={`Document ${index + 1}`}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <iframe
                            src={doc}
                            title={`Document ${index + 1}`}
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No dispatch documents available
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminVerifyDispatch;
