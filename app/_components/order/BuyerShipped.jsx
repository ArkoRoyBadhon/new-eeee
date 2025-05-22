import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Calendar,
  FileText,
  ExternalLink,
  Download,
  Eye,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BuyerShipped = ({ id, order }) => {
  const shippingInfo = {
    expectedDelivery: "May 20, 2023",
    trackingNumber: id || "SH123456789",
    carrier: "FedEx",
    trackingLink: "https://www.fedex.com/tracking",
    dispatchDocuments: [
      {
        name: "Shipping Label",
        url: "https://res.cloudinary.com/dlfxrxafc/image/upload/v1746954767/kingmansa/order/order_label_kalvfk.jpg",
      },
      {
        name: "Commercial Invoice",
        url: "https://res.cloudinary.com/dlfxrxafc/image/upload/v1746954767/kingmansa/order/order_invoice_zg4ufi.avif",
      },
    ],
  };

  const calculateExpectedDelivery = (createdAt, days = 60) => {
    if (!createdAt) return "Calculating...";

    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + days); // days should be 60

    return deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = (url, filename) => {
    fetch(url, {
      mode: "cors",
      headers: new Headers({
        Origin: window.location.origin,
      }),
    })
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
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-[#DFB547]" />
          <h3 className="text-[#555555] font-medium">
            Your order has been dispatched
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Expected delivery</p>
                <p className="font-medium">
                  {calculateExpectedDelivery(order.createdAt, 60)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Carrier</p>
                <p className="font-medium">{shippingInfo.carrier}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tracking number</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{shippingInfo.trackingNumber}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[#DFB547] hover:bg-[#DFB547]/10"
                  onClick={() =>
                    navigator.clipboard.writeText(shippingInfo.trackingNumber)
                  }
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="">
              <Button
                variant="outline"
                className="flex-1 md:flex-auto gap-2 text-[#DFB547] border-[#DFB547] hover:bg-[#DFB547]/10"
                onClick={() => window.open(shippingInfo.trackingLink, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Track
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DFB547]/20">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dispatch Documents
          </h4>
          <div className="flex flex-wrap gap-2">
            {shippingInfo.dispatchDocuments.map((doc, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 text-gray-700 hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4 text-[#DFB547]" />
                    {doc.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => window.open(doc.url, "_blank")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Document
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleDownload(
                        doc.url,
                        `${doc.name.replace(/\s+/g, "_")}.${doc.url
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
            ))}
          </div>
        </div>

       
      </CardContent>
    </Card>
  );
};

export default BuyerShipped;
