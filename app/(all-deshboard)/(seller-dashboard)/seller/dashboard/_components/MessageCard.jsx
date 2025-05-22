import InquiryCard from "@/app/_components/InquiryCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const MessageCard = () => {
  const dymmyMessage = [
    {
      _id: "1",
      title: "John Doe",
      min_order: 2,
      date: "yesterday",
      unseen: 2,
    },
  ];

  return (
    <Card className="w-full custom-shadow rounded-[16px] p-0 overflow-hidden gap-0">
      <CardHeader className=" bg-[#FDF5E5] py-[16px] px-[24px]">
        <CardTitle className="text-[18px] custom-text font-bold">
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4">
          {dymmyMessage?.map((msg) => (
            <div className="flex justify-between cursor-pointer p-6">
              <div className="flex">
                <Avatar className="w-[40px] h-[40px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="ml-2 flex flex-col gap-[8px]">
                  <div className="font-medium custom-text text-[14px]">
                    {msg.title}
                  </div>
                  <div className="text-[12px] text-[#363636] custom-text">
                    Min Order: {msg.min_order}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end gap-[8px]">
                <div className="text-[12px] text-[#363636] custom-text">
                  {msg.date}
                </div>
                <div className="text-[12px] text-white bg-black w-[16px] h-[16px] rounded-full flex justify-center items-center">
                  {msg.unseen}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
