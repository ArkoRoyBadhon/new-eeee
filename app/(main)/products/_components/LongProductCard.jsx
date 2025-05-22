"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function LongProductCard({ product }) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden py-0  flex-row w-full gap-2 xl:gap-[16px]">
      <div
        onClick={() => router.push(`/products/${product?.slug}`)}
        className="relative h-[256px] w-[25%] bg-stone-100 flex items-center justify-center cursor-pointer overflow-hidden group"
      >
        <Image
          src={product?.image[0] || "/placeholder.svg"}
          alt={product?.title || "Product"}
          width={200}
          height={200}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div
        onClick={() => router.push(`/products/${product?.slug}`)}
        className="cursor-pointer p-2 md:py-4 md:px-4 w-[55%]"
      >
        <div className="">
          <h3 className="font-semibold text-[20px] text-black custom-text md:mb-[16px] line-clamp-2 ">
            {product?.title}
          </h3>
        </div>
        <div className="text-[14px] text-[#555555] !line-clamp-3 custom-text hidden md:block">
          {product?.description}
        </div>
        {/* <div
          className=""
          dangerouslySetInnerHTML={{
            __html: product?.description || "No description available.",
          }}
        /> */}
        <p className="text-[24px] custom-text font-bold my-4">
          ${product?.price}
        </p>
        <p className="text-[14px] text-[#555555] custom-text">
          Min, order. {product?.minOrder}
        </p>
        <p className="text-[14px] text-[#555555] custom-text mt-1">
          origin{" "}
          <span className="bg-[#FDF5E5] px-2 py-1 rounded-[12px]">
            {product?.seller?.country}
          </span>
        </p>
      </div>

      <div className="md:pb-4 md:pt-0  flex justify-center items-center h-full w-[20%] pr-2">
        <div className="flex flex-col h-[80%] gap-2  pl-4">
          <Button
            onClick={() =>
              router.push(`/products/${product?.slug}?inquiry=true`)
            }
            variant="default"
            size="sm"
            className="bg-[#106CD0] hover:bg-[#106dd0e7] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[12px] xl:text-[14px] custom-text lg:h-[37px]"
          >
            Inquire Now
          </Button>
          <Button
            onClick={() => router.push(`/products/${product?.slug}?chat=true`)}
            variant="outline"
            size="sm"
            className="border border-[#DFB547] hover:bg-[#DFB547] hover:text-white !rounded-[55px] xl:px-[32px] !py-[8px] text-[12px] xl:text-[14px] custom-text lg:h-[37px] hidden lg:block"
          >
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}
