"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreById } from "@/lib/store/slices/storeSetupSlice";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/lib/api";
import { Star, FileText, BadgeCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyProfilePage({ params }) {
  const { id } = params;
  const dispatch = useDispatch();
  const { selectedStore, loading, error } = useSelector(
    (state) => state.storeSetup
  );
  const [activeTab, setActiveTab] = useState("description");

  // Fetch store details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchStoreById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <div className="container mx-auto px-5 py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-5 py-10">
        <p className="text-red-500">Error: {error}</p>
        <Link href="/" className="text-green-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="container mx-auto px-5 py-10">
        <p>Store not found</p>
        <Link href="/" className="text-green-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const {
    storeName,
    storeLogo,
    coverImage,
    storeDescription,
    companyWebsite,
    businessEmail,
    phoneNumber,
    addressLine1,
    country,
    contactPerson,
    legalStatus,
    natureOfBusiness,
    businessSector,
    certifications,
    businessDetails,
    abbfMembership,
  } = selectedStore;

  const rating = 3.8;
  const totalReviews = 20000;
  const verificationStatus = "KingMansa Verified";

  // Determine document type from file extension or name
  const getDocumentType = (filePath) => {
    if (!filePath) return "Unknown";
    const ext = filePath.split(".").pop().toLowerCase();
    return (
      {
        pdf: "PDF",
        xls: "XLS",
        xlsx: "XLS",
        png: "PNG",
        jpg: "Image",
        jpeg: "Image",
      }[ext] || "File"
    );
  };

  return (
    <div className="container mx-auto px-5 py-[50px]">
      <Card className="mb-10 overflow-visible shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] p-0 rounded-[16px]">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between md:items-center">
            <div className="flex flex-col lg:flex-row gap-4 items-center lg:w-[70%]">
              <div className="w-[160px] h-[160px] rounded-[16px] overflow-hidden relative flex items-center justify-center bg-gray-500/10">
                {storeLogo ? (
                  <Image
                    src={`${BASE_URL}${storeLogo}`}
                    alt={storeName}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                ) : (
                  <div className="text-white text-5xl font-bold">
                    {storeName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-around items-start gap-2 w-full">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl md:text-[32px] font-bold uppercase">
                    {storeName || "Taian Rope Limited Company"}
                  </h1>
                  {verificationStatus && (
                    <BadgeCheck
                      className="size-5 text-[#106CD0]"
                      aria-label="Verified"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500 lg:w-[60%]">
                  These farms may utilize modern techniques and integrate them
                  with traditional methods to boost production and
                  sustainability,
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-y-6 justify-center items-center">
              <div className="flex justify-between lg:border-l-2 lg:px-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[48px] font-bold text-[#DFB547]">
                    {rating}
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "fill-[#DFB547] text-[#DFB547]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm font-bold">Exceptional</div>
                  <div className="text-[12px] text-gray-500">
                    ({totalReviews.toLocaleString()}+){" "}
                    <span className="text-[#DFB547]">Reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center ml-auto lg:border-l-2 lg:pl-10 h-full">
                <Button className="bg-[#106CD0] hover:bg-[#106CD0]/90 rounded-full w-full">
                  Inquire Now
                </Button>
                <Button
                  variant="outline"
                  className="border-[#DFB547] hover:bg-[#DFB547]/90 rounded-full "
                >
                  Chat Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="description"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger
            value="description"
            className={activeTab === "description" ? "font-medium" : ""}
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className={activeTab === "products" ? "font-medium" : ""}
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className={activeTab === "reviews" ? "font-medium" : ""}
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-0">
          <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-5 gap-6">
                <div className="md:col-span-3 space-y-6">
                  <div>
                    <h2 className="text-[24px] font-bold mb-4">
                      About Our Company Mission & Vision
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-[18px] font-semibold">
                          Introduction
                        </h3>
                        <p className="text-sm mt-2">
                          Founded in 2009,{" "}
                          {storeName || "Taian Rope Limited Company"} set out
                          itself to be a leading contract security firm the
                          property, corporate, industrial, commercial, and
                          construction industries. The company is a member the
                          Protective Security Industry Association (PSIA).
                        </p>
                      </div>

                      <div>
                        <h3 className="text-[18px] font-semibold">
                          Mission statement
                        </h3>
                        <ul className="list-disc pl-6 text-sm mt-2 space-y-1">
                          <li>{storeName || "Taian Rope"}'s mission is to:</li>
                          <li>
                            Provide high-quality, affordable contract security
                            solutions.
                          </li>
                          <li>
                            Create and cultivate long-term relationships with
                            clients.
                          </li>
                          <li>
                            Respond immediately to the changing needs of our
                            clients.
                          </li>
                          <li>Achieve complete customer satisfaction.</li>
                          <li>Improve our services continuously.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-[18px] font-semibold">Vision</h3>
                        <p className="text-sm mt-2">
                          The vision at{" "}
                          {storeName || "Taian Rope Limited Company"} is of a
                          highly trained and efficient team of security and
                          custom service personnel, ready for anything that may
                          occur and quick to respond to customer needs concerns.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Documents Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Documents</h3>
                    <div className="flex justify-start  gap-4">
                      {businessDetails?.businessRegistration && (
                        <a
                          href={`${BASE_URL}${businessDetails.businessRegistration}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="w-6 h-6 text-blue-500 mr-2" />
                          <div>
                            <span className="text-sm font-medium block">
                              Business Registration
                            </span>
                            <span className="text-xs text-gray-500">
                              {getDocumentType(
                                businessDetails.businessRegistration
                              )}
                            </span>
                          </div>
                        </a>
                      )}
                      {businessDetails?.ownerIdentification && (
                        <a
                          href={`${BASE_URL}${businessDetails.ownerIdentification}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="w-6 h-6 text-blue-500 mr-2" />
                          <div>
                            <span className="text-sm font-medium block">
                              Owner Identification
                            </span>
                            <span className="text-xs text-gray-500">
                              {getDocumentType(
                                businessDetails.ownerIdentification
                              )}
                            </span>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-lg overflow-hidden h-64 md:h-full">
                    <Image
                      src={`${BASE_URL}${coverImage}`}
                      alt="Company facility"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <p>Product information will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Supplier Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {businessEmail || "info@taianrope.com"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {phoneNumber || "+1 234 567 8900"}
                    </p>
                    <p>
                      <span className="font-medium">Website:</span>{" "}
                      {companyWebsite || "www.taianrope.com"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {addressLine1 || "123 Business Street"},{" "}
                      {country || "United States"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Business Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Legal Status:</span>{" "}
                      {legalStatus || "Limited Company"}
                    </p>
                    <p>
                      <span className="font-medium">Nature of Business:</span>{" "}
                      {natureOfBusiness || "Manufacturing"}
                    </p>
                    <p>
                      <span className="font-medium">Business Sector:</span>{" "}
                      {businessSector || "Agriculture"}
                    </p>
                    <p>
                      <span className="font-medium">Certifications:</span>{" "}
                      {certifications || "ISO 9001, ISO 14001"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
