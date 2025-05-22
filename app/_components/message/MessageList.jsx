import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import React from "react";

const MessageList = ({ messages, showInquiry }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {showInquiry && (
        <Card className="mb-6 max-w-md mx-auto">
          <div className="p-4">
            <div className="font-medium mb-2">Inquiry</div>
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
              <div>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="font-medium mb-2">Requirements</div>
            <div className="p-3 bg-gray-300 rounded text-sm">
              Product specifications and requirements would be listed here.
            </div>
          </div>
        </Card>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex mb-4 ${
            msg.sender === "buyer" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.sender === "seller" && (
            <Avatar className="h-8 w-8 mr-2">
              <img src="/placeholder.svg?height=32&width=32" alt="Seller" />
            </Avatar>
          )}

          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === "buyer"
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            }`}
          >
            <p>{msg.content}</p>
            <div
              className={`text-xs mt-1 ${
                msg.sender === "buyer" ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {msg.timestamp}
            </div>
          </div>

          {msg.sender === "buyer" && (
            <Avatar className="h-8 w-8 ml-2">
              <img src="/placeholder.svg?height=32&width=32" alt="Buyer" />
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
