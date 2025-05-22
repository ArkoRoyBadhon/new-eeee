"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProductCard({ product }) {
  const router = useRouter();
  return (
    <Card className="overflow-hidden py-0 h-[331px] md:h-[310px] xl:h-[350px] 2xl:h-[331px] w-full gap-2 xl:gap-[16px]">
      {/* <Link href={`/products/${product?.slug}`}> */}
      <div
        onClick={() => router.push(`/products/${product?.slug}`)}
        className="relative h-[160px] bg-stone-100 flex items-center justify-center cursor-pointer"
      >
        <Image
          src={product?.image[0] || "/placeholder.svg"}
          alt={product?.title || "Product"}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent
        onClick={() => router.push(`/products/${product?.slug}`)}
        className="cursor-pointer p-2 md:py-0 md:px-4"
      >
        <h3 className="font-bold text-[14px] text-black custom-text md:mb-[16px] line-clamp-1 ">
          {product?.title}
        </h3>
        <div className="text-[14px] text-[#555555] !line-clamp-2 custom-text hidden md:block">
          {product?.description}
        </div>
        {/* <div
          className=""
          dangerouslySetInnerHTML={{
            __html: product?.description || "No description available.",
          }}
        /> */}
      </CardContent>
      {/* </Link> */}

      <CardFooter className="md:pb-4 md:pt-0 flex gap-2 p-2 md:py-0 md:px-4">
        <Button
          onClick={() => router.push(`/products/${product?.slug}?inquiry=true`)}
          variant="default"
          size="sm"
          className="bg-[#106CD0] hover:bg-[#106dd0e7] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[12px] xl:text-[14px] custom-text lg:h-[37px] flex-1"
        >
          Inquire Now
        </Button>
        <Button
          onClick={() => router.push(`/products/${product?.slug}?chat=true`)}
          variant="outline"
          size="sm"
          className="border border-[#DFB547] hover:bg-[#DFB547] hover:text-white !rounded-[55px] xl:px-[32px] !py-[8px] text-[12px] xl:text-[14px] custom-text lg:h-[37px] flex-1 hidden lg:block"
        >
          Chat
        </Button>
      </CardFooter>
    </Card>
  );
}
