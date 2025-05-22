import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import ProductReviewSection from "../../products/[slug]/_components/ReviewSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompanyProfileView = () => {
  return (
    <div className="customContainer">
      <Card className="custom-shadow p-[24px] rounded-[16px]">
        <div className="flex items-center gap-[32px]">
          <div className="w-[200px] h-[200px] bg-gray-400 rounded-[8px]">
            <Image
              src="/placeholder.svg"
              alt=""
              width={120}
              height={120}
              className="w-[200px] h-[200px] bg-gray-400 rounded-[8px]"
            />
          </div>
          <div className="flex flex-col gap-4 max-w-[512px]">
            <h2 className="text-[32px] custom-text font-bold">Company title</h2>

            <div className="flex items-center gap-2">
              <p className="text-[14px] custom-text font-bold">
                KingMansa Verified
              </p>
              <MdVerified color="blue" />
            </div>

            <p className="text-[14px] leading-[150%] tracking-[-1%] text-[#555555]">
              These farms may utilize modern techniques and integrate them with
              traditional methods to boost production and sustainability,
            </p>
          </div>
          <div className="h-[180px] border-r-2 w-1"></div>
          {/* rating  */}
          <div className="flex flex-col items-center gap-4">
            <h6 className="text-[48px] leading-[90%] tracking-[-1%] text-[#DFB547] font-bold">
              4.8
            </h6>
            <div className="flex">
              <Star color="#DFB547" fill="#DFB547" />
              <Star color="#DFB547" fill="#DFB547" />
              <Star color="#DFB547" fill="#DFB547" />
              <Star color="#DFB547" fill="#DFB547" />
              <Star />
            </div>
            <p className="text-[16px] custom-text font-bold">Exceptional</p>
            <p className="text-[14px] leading-[150%] tracking-[-1%] whitespace-nowrap">
              <span className="text-[#555555]">(20000+)</span>{" "}
              <span className="text-[#DFB547]">Reviews</span>
            </p>
          </div>

          <div className="h-[180px] border-r-2 w-1"></div>

          {/* butttons  */}
          <div className="flex flex-col gap-4">
            <Button
              // onClick={() => router.push(`/products/${product?.slug}`)}
              //   onClick={inquiryHandle}
              variant="default"
              size="sm"
              className="bg-[#106CD0] hover:bg-[#106dd0e7] rounded-[55px] px-[20px] py-[16px] cursor-pointer text-[14px] custom-text w-[140px]"
            >
              Inquire Now
            </Button>
            <Link href="/message">
              <Button
                variant="outline"
                size="sm"
                className="border border-[#DFB547] hover:bg-[#DFB547] hover:text-white !rounded-[55px] !px-[32px] !py-[8px] !text-[14px] custom-text w-[140px]"
              >
                Chat Now
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="description" className="mb-6  ">
        <TabsList className="grid grid-cols-4 bg-transparent w-[648px]">
          <TabsTrigger
            value="description"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none  outline-none"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none  outline-none"
          >
            Products
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

        <Card className="custom-shadow p-4">
          <TabsContent value="description" className="pt-6">
            <div className="space-y-4">
              <h3 className="text-[16px] custom-text font-bold">
                About this product
              </h3>
              {/* <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product?.description || "No description available.",
                }}
              /> */}
            </div>
          </TabsContent>
          <TabsContent value="products" className="pt-6">
            <ProductReviewSection />
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <ProductReviewSection />
          </TabsContent>

          <TabsContent value="supplier" className="pt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Supplier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent>
                    <p className="font-medium">Supplier Name</p>
                    <p className="text-gray-600">{"Not available"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className="font-medium">Supplier Rating</p>
                    <p className="text-gray-600">{"Not available"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className="font-medium">Response Rate</p>
                    <p className="text-gray-600">{"Not available"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className="font-medium">Response Time</p>
                    <p className="text-gray-600">{"Not available"}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CompanyProfileView;
