import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";

export default function Message() {
  return (
    <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] py-0">
      <CardHeader className="text-[18px] font-bold bg-[#FDF5E5] px-6 py-4">
        Message
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex justify-between items-center">
          <div>
            <div>
              <Image
                src="/assets/verifyIcon.png"
                alt="user"
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
