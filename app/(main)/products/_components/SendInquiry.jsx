"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet";
import PageTitle from "@/app/_components/Typography/PageTitle";
import { useRouter } from "next/navigation";
import ProductQuantity from "../[slug]/_components/ProductQuantity";
import { inquiryApi } from "@/lib/api";
import { useSelector } from "react-redux";

export default function SendInquiryModal({
  open,
  onClose,
  quantity,
  setQuantity,
  product,
}) {
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const inquiryHandle = async () => {
    if (!product?._id || !user?._id) {
      toast.error("Product or user information is missing");
      return;
    }

    try {
      const payload = {
        productId: product._id,
        buyerId: user._id,
        sellerId: product.seller,
        messages: [
          {
            senderId: user._id,
            senderType: "buyer",
            text:
              message ||
              "Hi, I'm interested in this product. Can you provide more details?",
            inquiry: true,
            quantity: quantity || 1, // default to 1 if quantity not provided
          },
        ],
        inquiry: true,
        inquiryQuantity: quantity || 1,
        isClosed: false,
      };

      const response = await inquiryApi.createInquiry(payload);

      if (response?.message === "Inquiry already exists") {
        router.push(`/${user?.role}/message?inquiry=${response?.isexist?._id}`);
        toast.success("Redirected to existing inquiry");
      } else if (response?._id) {
        router.push(`/${user?.role}/message?inquiry=${response._id}`);
        toast.success("Inquiry created successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create inquiry. Please try again."
      );
      router.push("/message");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        size="lg"
        className="min-w-[100vw] xl:min-w-[1200px] w-full h-[100vh] overflow-auto overflow-x-hidden"
      >
        <SheetHeader className="border-b">
          <PageTitle>Send Inquiry</PageTitle>
        </SheetHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-medium">To:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Profile"
                  width={24}
                  height={24}
                />
              </div>
              <span className="font-medium">
                {product?.seller?.firstName} {product?.seller?.lastName}
              </span>
            </div>
            <span className="text-gray-600">
              {product?.seller?.companyName}
            </span>
            <div className="ml-1 bg-amber-100 text-amber-800 p-1 rounded">
              <span className="text-xs">⭐</span>
            </div>
          </div>

          {/* Product */}
          <div className="flex items-center gap-4 p-4 border rounded-md">
            <div className="w-16 h-16 flex-shrink-0">
              <Image
                src={product?.image[0] || "/img/img1.webp"}
                alt="Product"
                width={64}
                height={64}
                className="object-contain w-16 h-16 rounded-[12px]"
              />
            </div>
            <div className="flex-grow">
              <p className="font-medium">{product?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-fit">
                <ProductQuantity
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              </div>
            </div>
          </div>

          <div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your sourcing requirements for product attributes, quantity, or other supplier services. Or, write faster with our Smart Assistant below."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Try inquiry questions suggested by</span>
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  ➔
                </div>
                <span className="font-medium">Smart Assistant</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm">
                <span>➔</span>
                <span>What safety features included?</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm">
                <span>➔</span>
                <span>What is the warranty period?</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm">
                <span>➔</span>
                <span>What are the dimensions?</span>
              </button>
            </div>

            <button className="flex items-center gap-2 text-gray-700">
              <span className="w-5 h-5 border rounded flex items-center justify-center">
                ✓
              </span>
              <span>Enter other topics</span>
            </button>
          </div>
        </div>

        <SheetFooter className="">
          <div className="p-6 border-t flex justify-end items-center">
            {message ? (
              <Button
                onClick={inquiryHandle}
                className="px-6 py-2 bg-orange-400 hover:bg-[#DFB547] text-white rounded-full"
              >
                Send inquiry
              </Button>
            ) : (
              <Button
                disabled
                className="px-6 py-2 bg-orange-300  text-white rounded-full"
              >
                Send inquiry
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
