"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import React from "react";

const ProductQuantity = ({ quantity, setQuantity }) => {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  return (
    <div className="flex items-center">
      <span className="font-bold">Quantity:</span>
      <div className="flex items-end pl-4">
        <Button
          variant="outline"
          size="icon"
          className="h-[53px] w-[53px] rounded-full hover:bg-[#DFB547] hover:text-white"
          onClick={increaseQuantity}
        >
          <Plus className="" />
        </Button>
        <p className="h-10 w-16 border-none text-bold outline-none text-center">
          {quantity}
        </p>
        <Button
          variant="outline"
          size="icon"
          className="h-[53px] w-[53px] rounded-full hover:bg-[#DFB547] hover:text-white"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
        >
          <Minus className="" />
        </Button>
      </div>
    </div>
  );
};

export default ProductQuantity;
