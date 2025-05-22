"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import OrderProcessSteps from "./OrderProcessSteps";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { inquiryApi, orderApi } from "@/lib/api";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const OrderRequestView = () => {
  const inquiryId = useSearchParams().get("id");
  const [singleConversation, setSingleConversation] = useState(null);
  const [formData, setFormData] = useState({
    quantity: "",
    color: "",
    material: "",
    additionalNote: "",
    shippingAddress: "",
    shippingMethod: "",
    isAccepted: false,
  });
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await inquiryApi.getInquiries(inquiryId);
        setSingleConversation(response);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    })();
  }, [inquiryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, isAccepted: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalAmount =
        singleConversation?.productId?.salePrice * formData.quantity;

      const orderData = {
        product: singleConversation?.productId?._id,
        seller: singleConversation?.productId?.seller,
        quantity: formData.quantity,
        color: formData.color,
        material: formData.material,
        additionalNote: formData.additionalNote,
        price: singleConversation?.productId?.salePrice,
        total: totalAmount,
        shippingAddress: formData.shippingAddress,
        shippingMethod: formData.shippingMethod,
        // upfrontAmount: totalAmount * 0.3, // 30% of total
        // postDeliveryAmount: totalAmount * 0.7, // 70% of total
        payStatus: "Pending",
        isAgreeTerm: formData.isAccepted,
        inquiry: inquiryId,
      };

      console.log(orderData);

      if (!formData.quantity) {
        toast.warning("Please enter quantity");
        return;
      }
      if (!formData.shippingAddress) {
        toast.warning("Please enter shipping address");
        return;
      }
      if (!formData.shippingMethod) {
        toast.warning("Please enter shipping method");
        return;
      }

      if (!orderData.isAgreeTerm) {
        toast.warning("Please agree to terms and conditions");
        return;
      }

      const response = await orderApi.createOrder(orderData, token);

      toast.success("Order submitted successfully!");
      setFormData({
        quantity: "",
        color: "",
        material: "",
        additionalNote: "",
        shippingAddress: "",
        shippingMethod: "",
        isAccepted: false,
      });

      router.push(`/buyer/my-orders`);
    } catch (error) {
      toast.error("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="max-w-[791px] mx-auto py-8">
      <h1 className="text-[32px] font-bold mb-6 custom-text px-4 lg:px-0">
        Send order request
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="">
          <Card className="border-0 custom-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-[20px] font-bold leading-[150%] tracking-[-1%]">
                Product details
              </CardTitle>
              <p className="text-[16px] text-[#111111] custom-text">
                Specify your purchase details and let the supplier know your
                requirements.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-[#555555] mb-4 capitalize font-bold text-[14px] leading-[18px]">
                  {singleConversation?.sellerId?.firstName}{" "}
                  {singleConversation?.sellerId?.lastName}
                </p>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12">
                    <Image
                      src={singleConversation?.productId?.image[0]}
                      alt="product"
                      height={200}
                      width={200}
                      className="object-cover w-full h-full rounded-[16px]"
                    />
                  </div>
                  <div>
                    <p className="font-bold leading-[150%] tracking-[-1%] text-[16px] capitalize text-[#111111]">
                      {singleConversation?.productId?.title}
                      {/* Ergonomic Office Chair with Lumbar Support */}
                    </p>
                    <p className="text-[16px] text-[#111111]">
                      SKU:{" "}
                      <span className="text-[#555555]">
                        {singleConversation?.productId?.sku}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-bold leading-[150%] tracking-[-1%] text-[16px] capitalize text-[#111111]">
                    Order Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center bg-[#F2F2F2] p-4 rounded-[8px]">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="quantity.."
                        className="outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 bg-transparent shadow-none pl-4"
                      />
                    </div>
                    <div className="flex items-center bg-[#F2F2F2] p-4 rounded-[8px]">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        name="color"
                        type="text"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="color.."
                        className="outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 bg-transparent shadow-none pl-4"
                      />
                    </div>
                    <div className="flex items-center bg-[#F2F2F2] p-4 rounded-[8px]">
                      <Label htmlFor="material">Meterial</Label>
                      <Input
                        name="material"
                        type="text"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="material..."
                        className="outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 bg-transparent shadow-none pl-4"
                      />
                    </div>
                    <div className="flex items-center bg-[#F2F2F2] p-4 rounded-[8px]">
                      <Label
                        htmlFor="additionalNote"
                        className="whitespace-nowrap"
                      >
                        Additional Notes:
                      </Label>
                      <Input
                        name="additionalNote"
                        type="text"
                        value={formData.additionalNote}
                        onChange={handleChange}
                        placeholder="additional notes..."
                        className="outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 bg-transparent shadow-none pl-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <p className="font-bold leading-[150%] tracking-[-1%] text-[16px] capitalize text-[#111111]">
                    Shipping Address
                  </p>
                  <div className="flex items-center bg-[#F2F2F2] p-4 rounded-[8px]">
                    <Label htmlFor="shippingAddress">Address</Label>
                    <Input
                      name="shippingAddress"
                      type="text"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      placeholder="address.."
                      className="outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 bg-transparent shadow-none pl-4"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-6">
                  <p className="font-bold leading-[150%] tracking-[-1%] text-[16px] capitalize text-[#111111]">
                    Preferred Shipping Method
                  </p>
                  <div className="flex items-center bg-[#F2F2F2] p-4 rounded-[8px] ">
                    <Select
                      value={formData.shippingMethod}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          shippingMethod: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full border-none outline-none focus:outline-none focus:border-none focus-visible:ring-0 bg-transparent shadow-none">
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-[#FDF5E5] rounded-[16px] p-4">
                    <p className="font-bold leading-[150%] text-[16px] capitalize text-[#111111]">
                      Expected Delivery Date
                    </p>
                    <p className="text-[#555555] text-[14px] leading-[150%] mt-2">
                      Within 30 days of order confirmation
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="isAccepted"
                      name="isAccepted"
                      checked={formData.isAccepted}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label
                      htmlFor="isAccepted"
                      className="ml-2 text-[#555555] text-[14px] custom-text"
                    >
                      I accept the terms and conditions
                    </Label>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="text-[20px] font-bold leading-[150%] tracking-[-1%] mb-4">
                    {`What's Next?`}
                  </h4>
                  <OrderProcessSteps />
                </div>

                <Button className="cursor-pointer bg-[#DFB547] hover:bg-[#DFB547]/90 rounded-[55px] px-[24px] py-[6px] mt-12 text-black hover:text-white">
                  Submit to Supplier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default OrderRequestView;
