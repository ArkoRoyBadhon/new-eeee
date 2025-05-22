"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

const InquiryCard = ({ headingTitle, singleConversation, gateway }) => {
  const [showRequirements, setShowRequirements] = useState(false);
  const router = useRouter();

  const inquiryMessage = singleConversation?.messages?.find(
    (msg) => msg.inquiry
  );

  const productTitle =
    singleConversation?.productId?.title ||
    singleConversation?.product?.title ||
    "Product Title";
  const minOrder = singleConversation?.productId?.minOrder || 2;
  const quantity =
    inquiryMessage?.quantity || singleConversation?.quantity || 0;
  const greetingText =
    "Hello,\nI'm interested in your product and would like to know more details.\nThank you";
  const inquiryText = inquiryMessage?.text || "N/A";
  const inquiryId = singleConversation?._id || "N/A";
  const createdAt = singleConversation?.createdAt
    ? new Date(singleConversation.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <Card
      key={inquiryId}
      className="mx-auto w-full max-w-[420px] gap-3 p-4 mb-4 custom-shadow"
    >
      {/* Heading */}
      <div
        className={`font-bold text-[15px] custom-text mb-3 ${
          gateway === "supplier" && "hidden"
        }`}
      >
        {headingTitle}
      </div>

      {/* Seller/Product Info */}
      <div
        onClick={() => {
          gateway === "supplier" &&
            router.push(`/seller/orders/${inquiryId}`);
        }}
        className="flex items-center gap-3 mb-4 cursor-pointer"
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[14px] leading-[120%] capitalize">
            {productTitle}
          </p>
          <p className="text-[12px] text-[#555555]">Min. order: {minOrder}</p>
          <p className="text-[12px] text-[#555555]">
            Inquiry date: {createdAt}
          </p>
        </div>
      </div>

      {/* Inquiry Details */}
      <div className="bg-[#FDF5E5] rounded-[16px] p-4 flex flex-col gap-3">
        <div
          onClick={() => {
            gateway === "supplier" &&
              router.push(`/seller/orders/${inquiryId}`);
          }}
          className="flex flex-col gap-3 cursor-pointer"
        >
          <div>
            <p className="text-[14px] text-[#555555]">Quantity</p>
            <p className="font-bold">
              {quantity} Piece{quantity !== 1 ? "s" : ""}
            </p>
          </div>

          <div>
            <p className="text-[14px] text-[#555555]">Detailed requirements</p>
            <p className="text-[14px] whitespace-pre-line">{greetingText}</p>
          </div>

          <div>
            <p className="text-[14px] text-[#555555]">
              Inquiry ID: {inquiryId}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <Button
            variant="ghost"
            className="flex items-center gap-1 p-0 text-[14px] text-[#555555] bg-[#DFB547] hover:bg-[#e7cb82] w-full"
            onClick={() => setShowRequirements(!showRequirements)}
          >
            {showRequirements ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Requirements
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Requirements
              </>
            )}
          </Button>

          {showRequirements && (
            <div className="mt-2 p-3 bg-white capitalize rounded-md border text-[14px] custom-text text-[#555555]">
              {singleConversation?.invoice ? (
                <>
                  Quantity: {singleConversation?.quantity}
                  <br />
                  Color: {singleConversation?.color}
                  <br />
                  Material: {singleConversation?.material}
                  <br />
                  Additional Note: {singleConversation?.additionalNote}
                </>
              ) : (
                inquiryText
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InquiryCard;
