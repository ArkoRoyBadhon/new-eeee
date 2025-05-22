"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { fetchStoreStatus } from "@/lib/store/slices/storeSetupSlice";
import { fetchCatalogs } from "@/lib/store/slices/catalogSlice";
import CatalogList from "../catalog/CatalogGrid";

const StatusBanner = ({ status }) => {
  if (!status) return null;
};

const StoreSetup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const {
    status: storeStatus,
    loading: storeLoading,
    error: storeError,
  } = useSelector((state) => state.storeSetup);
  const {
    catalogs,
    loading: catalogLoading,
    error: catalogError,
  } = useSelector((state) => state.catalog);

  // Fetch store status and catalogs on mount
  useEffect(() => {
    if (user && token) {
      dispatch(fetchStoreStatus());
      dispatch(fetchCatalogs());
    }
  }, [user, token, dispatch]);

  // Handle Verify Now button click
  const handleVerifyNow = () => {
    router.push("/seller/store/store-setup");
  };

  if (
    storeStatus === "pending" ||
    storeStatus === "approved" ||
    storeStatus === "rejected"
  ) {
    return (
      <div className="min-h-[100vh]">
        <StatusBanner status={storeStatus} />
        {/* Store Setup Status Section - Show only if no catalogs exist */}
        {catalogs.length === 0 && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-[16px] shadow-[0_0px_12px_5px_rgba(0,0,0,0.1)] p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Store Setup Status</h2>
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
                    <div className="relative flex justify-between w-64">
                      <div
                        className={`flex flex-col items-center ${
                          storeStatus === "approved"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            storeStatus === "approved"
                              ? "bg-green-100 border-2 border-green-500"
                              : "bg-gray-100 border-2 border-gray-300"
                          }`}
                        >
                          {storeStatus === "approved" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span>1</span>
                          )}
                        </div>
                        <span className="text-xs mt-1">Submitted</span>
                      </div>
                      <div
                        className={`flex flex-col items-center ${
                          storeStatus === "approved"
                            ? "text-green-600"
                            : storeStatus === "pending"
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            storeStatus === "approved"
                              ? "bg-green-100 border-2 border-green-500"
                              : storeStatus === "pending"
                              ? "bg-yellow-100 border-2 border-yellow-500"
                              : storeStatus === "rejected"
                              ? "bg-red-100 border-2 border-red-500"
                              : "bg-gray-100 border-2 border-gray-300"
                          }`}
                        >
                          {storeStatus === "approved" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : storeStatus === "rejected" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span>2</span>
                          )}
                        </div>
                        <span className="text-xs mt-1">Review</span>
                      </div>
                      <div
                        className={`flex flex-col items-center ${
                          storeStatus === "approved"
                            ? "text-green-600"
                            : storeStatus === "pending" ||
                              storeStatus === "rejected"
                            ? "text-gray-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            storeStatus === "approved"
                              ? "bg-green-100 border-2 border-green-500"
                              : "bg-gray-100 border-2 border-gray-300"
                          }`}
                        >
                          {storeStatus === "approved" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span>3</span>
                          )}
                        </div>
                        <span className="text-xs mt-1">Approved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    storeStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : storeStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {storeStatus.toUpperCase()}
                </div>
              </div>

              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">What's next?</h3>
                {storeStatus === "pending" && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Our team is reviewing your submission</li>
                    <li>This process typically takes 1-2 business days</li>
                    <li>You'll receive an email notification once reviewed</li>
                  </ul>
                )}
                {storeStatus === "approved" && catalogs.length === 0 && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You can now set up your company profile</li>
                    <li>Start adding products to your store</li>
                    <li>Configure your payment and shipping settings</li>
                  </ul>
                )}
                {storeStatus === "rejected" && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Please review the reasons for rejection</li>
                    <li>Make necessary corrections to your information</li>
                    <li>Resubmit your store setup application</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Your Catalogs Section - Always show when store is approved */}
        {storeStatus === "approved" && <CatalogList catalogs={catalogs} />}

        <div className="flex justify-center gap-4 mt-6">
          {storeStatus === "rejected" && (
            <Button
              onClick={() => router.push("/seller/store/store-setup?step=1")}
              className="bg-[#001C44] hover:bg-[#001C44]/90 text-white"
            >
              Resubmit Application
            </Button>
          )}
          {storeStatus === "approved" && catalogs.length === 0 && (
            <Button
              onClick={() => router.push("/seller/store/catalog-create")}
              className="bg-[#001C44] hover:bg-[#001C44]/90 text-white"
            >
              Create Catalog
            </Button>
          )}
          {storeStatus === "rejected" && (
            <Button
              onClick={() => router.push("/seller/company&site")}
              className="bg-[#001C44] hover:bg-[#001C44]/90 text-white"
            >
              Go to Company & Site
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center space-y-4 min-h-screen flex flex-col items-center justify-center">
        <p className="text-[18px]">
          You need to be logged in to complete the store setup process.
        </p>
        <Button onClick={() => (window.location.href = "/login")}>Login</Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 min-h-[100vh] flex flex-col items-center justify-center">
      <p className="text-[18px]">
        To upload products and catalogs, please verify your store/business
        first. <br /> Click the button below to start the verification process.
      </p>
      <Button
        onClick={handleVerifyNow}
        size="lg"
        className="mt-4 bg-[#001C44] hover:bg-[#001C44]/90 text-white"
      >
        Verify Now
      </Button>
    </div>
  );
};

export default StoreSetup;
