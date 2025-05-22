"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductGallery from "./ProductGallery";
import ProductQuantity from "./ProductQuantity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductRecomendation from "@/app/_components/ProductRecomendation";
import { inquiryApi, productApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import "react-quill-new/dist/quill.snow.css";
import { Separator } from "@/components/ui/separator";
import ProductReviewSection from "./ReviewSection";
import SendInquiryModal from "../../_components/SendInquiry";
import SupplierInfo from "./SupplierInfo";

const ProductDetail = ({ slug }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openInquiry, setOpenInquiry] = useState(false);
  const inquiryQuery = useSearchParams().get("inquiry");
  const chatQuery = useSearchParams().get("chat");

  // i need to get corrent route
  const [currentRoute, setCurrentRoute] = useState(window.location.href);
  console.log("currentRoute", currentRoute);

  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleChat = async () => {
    try {
      const payload = {
        buyerId: user?._id,
        productId: product?._id,
      };

      console.log("Sending inquiry payload:", payload);

      const response = await inquiryApi.getMessage(
        product?.seller?._id,
        payload
      );

      if (response) {
        router.push(`/${user?.role}/message?inquiry=${response?._id}`);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productApi.getProductBySlug(slug);
        setProduct(response);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (inquiryQuery) {
      setOpenInquiry(true);
    }
    if (chatQuery && product && user) {
      console.log("chat query", chatQuery);

      handleChat();
    }
  }, [inquiryQuery, chatQuery, product, user]);

  if (isLoading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  return (
    <div className="customContainer py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-[60%] xl:w-[648px]">
          {product?.image?.length > 0 ? (
            <ProductGallery images={product?.image} />
          ) : (
            <div className="h-[400px] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        <div className="md:w-[40%] xl:w-[510px] flex flex-col gap-[32px]">
          <h1 className="text-[24px] font-bold leading-[120%] tracking-[-1%] capitalize">
            {product?.title || "Product Name"}
          </h1>
          <div className="">{product?.description}</div>
          {/* <div
            className="prose max-w-none !line-clamp-6"
            dangerouslySetInnerHTML={{
              __html: product?.description || "No description available.",
            }}
          /> */}

          <div className="variants">
            <span className="font-bold">Variants:</span>
            {product?.variants?.map((item, i) => {
              return (
                <div key={i} className="px-4 py-2 border rounded-lg w-fit mt-2">
                  <p className="text-[#555555]">{item?.value}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <ProductQuantity quantity={quantity} setQuantity={setQuantity} />

            <div className="flex flex-row gap-4">
              <Button
                // onClick={() => router.push(`/products/${product?.slug}`)}
                onClick={() => setOpenInquiry(true)}
                variant="default"
                size="sm"
                className="bg-[#106CD0] hover:bg-[#106dd0e7] rounded-[55px] px-[40px] py-[16px] cursor-pointer text-[14px] custom-text lg:w-[364px] lg:h-[53px]"
              >
                Inquire Now
              </Button>
              {/* <Link href="/message"> */}
              <Button
                onClick={handleChat}
                variant="outline"
                size="sm"
                className="border border-[#DFB547] hover:bg-[#DFB547] hover:text-white !rounded-[55px] !px-[32px] !py-[8px] !text-[14px] custom-text lg:h-[53px]"
              >
                Chat
              </Button>
              {/* </Link> */}
            </div>
            <p className="text-[#555555] text-[14px] custom-text">
              Or, chat with the product supplier for more shipping options.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="attributes" className="mb-6 w-full lg:w-[648px] ">
        <TabsList className="grid w-full grid-cols-4 bg-transparent">
          <TabsTrigger
            value="attributes"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none  outline-none"
          >
            Attributes
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none  outline-none"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none  outline-none"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="supplier"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none  outline-none"
          >
            Supplier
          </TabsTrigger>
        </TabsList>

        <Separator />
        <TabsContent value="attributes" className="pt-6">
          {product?.attributes.map((item, index) => {
            return (
              <div key={index} className="flex gap-10 mb-4">
                <div className="flex-1">
                  <p className="">{item.key}</p>
                </div>
                <div className="flex-1">
                  <p className="">{item.value}</p>
                </div>
              </div>
            );
          })}
        </TabsContent>
        <TabsContent value="description" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-[16px] custom-text font-bold">
              About this product
            </h3>
            <div className="">{product?.description}</div>
            {/* <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: product?.description || "No description available.",
              }}
            /> */}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <ProductReviewSection product={product} />
        </TabsContent>

        <TabsContent value="supplier" className="pt-6">
          <SupplierInfo product={product} />
        </TabsContent>
      </Tabs>

      {openInquiry && (
        <SendInquiryModal
          open={openInquiry}
          onClose={() => setOpenInquiry(false)}
          quantity={quantity}
          setQuantity={setQuantity}
          product={product}
        />
      )}

      {/* Recommendations */}
      {!currentRoute.includes("seller/store") && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Other recommendations for your business
          </h2>
          <ProductRecomendation />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
