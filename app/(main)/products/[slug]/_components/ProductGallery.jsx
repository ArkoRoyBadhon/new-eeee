"use client";
import Image from "next/image";
import React, { useState } from "react";

const ProductGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-row gap-2 lg:gap-4 h-[360px] lg:h-[516px]">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 order-1">
        {images.length > 0 &&
          images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border-2 rounded-[16px] overflow-hidden ${
                selectedImage === index ? "border-black" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative w-[81px] lg:w-[120px] h-[calc(360px/4)] lg:h-[calc(516px/4)]">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover  rounded-[16px] w-[81px] lg:w-[120px] h-[calc(360px/4)] lg:h-[calc(516px/4)]"
                />
              </div>
            </div>
          ))}
      </div>

      {/* Main Image */}
      <div className="relative h-[360px] lg:h-[516px] w-full order-1 md:order-2">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Product main image"
          fill
          className="object-cover bg-gray-100 rounded-[12px] h-[360px] lg:h-[516px] lg:w-[516px]"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
