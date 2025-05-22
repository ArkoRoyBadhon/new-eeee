"use client";

import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { orderApi, transactionApi } from "@/lib/api";

const PaymentDetail = ({ id, order, setOrderStatus }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [formData, setFormData] = useState({
    cardNumber: "4242424242424242",
    expiry: "12/26",
    cvc: "111",
    name: "Arko",
    billingAddress: "Dhaka, Bangladesh",
    city: "Dhaka",
    zip: "1207",
    transferConfirmation: true,
    transferDate: new Date().toISOString().split("T")[0],
    transferAmount: 500,
  });
  const { token, user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const orderApiFunc = async () => {
    console.log("Processing payment... order api");

    try {
      const transactionData = {
        user: user?._id,
        order: order?._id,
        currency: "USD",
        paymentMethod: "Card",
        amount: order?.total * (order?.payTerms?.upfront / 100 || 0.3),
        description: `Payment for order ${order?._id}`,
        status: "Completed",
        reference: order?._id,
      };

      const payCreate = await transactionApi.createTransaction(
        transactionData,
        token
      );

      console.log("Payment created:", payCreate);

      const response = await orderApi.updateOrder(
        id,
        {
          status: "Processing",
          payStatus: "Upfront",
          upfrontAmount: order?.total * (order?.payTerms?.upfront / 100 || 0.3),
          depositDate: new Date(),
          total: order?.total,
        },
        token
      );
      toast.success("Payment processed successfully!");
      setOrderStatus(response.status);
    } catch (error) {
      toast.error("Payment failed!");
    }
  };

  const handleSubmit = () => {
    // console.log("Processing payment...", formData);
    if (paymentMethod === "credit-card") {
      if (
        !formData.cardNumber ||
        !formData.expiry ||
        !formData.cvc ||
        !formData.name
      ) {
        toast.warning("Please fill in all required credit card details.");
        return;
      }
      console.log("Credit Card Payment Data:", formData);

      orderApiFunc();
    } else if (paymentMethod === "bank-transfer") {
      if (
        !formData.transferConfirmation ||
        !formData.transferDate ||
        !formData.transferAmount
      ) {
        toast.warning("Please fill in all required bank transfer details.");
        return;
      }
      console.log("Bank Transfer Payment Data:", formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your payment information securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
              <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
            </TabsList>
            <TabsContent
              value="credit-card"
              className="space-y-4 pt-4 w-[460px]"
            >
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="10001"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="bank-transfer"
              className="space-y-4 pt-4 w-[460px]"
            >
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Make a bank transfer to the following account:
                </p>
                {/* Bank details */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferConfirmation">
                  Transfer Confirmation Number
                </Label>
                <Input
                  id="transferConfirmation"
                  value={formData.transferConfirmation}
                  onChange={handleChange}
                  placeholder="Enter your bank reference"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferDate">Transfer Date</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={formData.transferDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferAmount">Transfer Amount</Label>
                <Input
                  id="transferAmount"
                  value={formData.transferAmount}
                  onChange={handleChange}
                  placeholder="$2,575.00"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Lock className="mr-1 h-3 w-3" /> Secured by 256-bit encryption
        </div>
        <Button
          className="bg-[#001C44] hover:bg-[#001C44] text-white/80 hover:text-white"
          onClick={handleSubmit}
        >
          Pay Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentDetail;
