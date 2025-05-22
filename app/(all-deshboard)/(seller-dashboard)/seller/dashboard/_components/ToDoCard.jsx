import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const ToDoCard = ({ key, item }) => {
  const IconComponent = item.icon;
  return (
    <Card key={key} className=" bg-[#001C44] rounded-[8px] overflow-hidden p-4">
      <CardContent className="">
        <div className="h-[52px] border-b border-[#FFFFFF33] flex justify-between ">
          <p className="text-white text-[26px] font-bold ">{item.count}</p>
          <div className="w-[36px] h-[36px] rounded-[8px] p-2 bg-[#DFB547]">
            <IconComponent className="text-white" size={20} />
          </div>
        </div>
        <div className="pt-2">
          <p className="text-[#FFFFFFB2] text-[14px] font-bold">{item.title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToDoCard;
