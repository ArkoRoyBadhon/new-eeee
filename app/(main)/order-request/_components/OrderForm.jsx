"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import OrderProcessSteps from "./OrderProcessSteps";

const OrderForm = ({ productName, productModel, supplierName }) => {
  const [orderDetails, setOrderDetails] = useState("");
  const [requirements, setRequirements] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      toast({
        title: "Order request submitted",
        description: "Your order request has been sent to the supplier.",
      });

      // Reset form or redirect
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your order request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Details Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Product details
          </CardTitle>
          <p className="text-sm text-gray-500">
            Specify your purchase details and let the supplier know your
            requirements.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-4">{supplierName}</p>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded shrink-0"></div>
              <div>
                <p className="font-medium text-sm">{productName}</p>
                <p className="text-sm text-gray-500">Model: {productModel}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Enter your order details (quantity, color, size, etc.)"
                className="min-h-[100px]"
                value={orderDetails}
                onChange={(e) => setOrderDetails(e.target.value)}
                required
              />
              <Textarea
                placeholder="Enter any specific requirements or customizations"
                className="min-h-[100px]"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Details Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Shipping details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Shipping address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
            <Input
              placeholder="Contact person name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <Input
              placeholder="Contact phone number"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* What's Next Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            What&apos;s next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderProcessSteps />

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT SUPPLIER"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default OrderForm;
