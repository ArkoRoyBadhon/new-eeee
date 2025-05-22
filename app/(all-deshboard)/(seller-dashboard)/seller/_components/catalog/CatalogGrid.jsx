"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  PackagePlus,
  PackageOpen,
  EllipsisVertical,
  GalleryVerticalEnd,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_URL, productApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// import { useSelector } from "react-redux";
import AddProductTem from "@/app/_components/temporary/AddProductTem";
import ProductDetail from "@/app/(main)/products/[slug]/_components/ProductDetail";
import PaginationFooter from "@/app/_components/PaginationFooter";
import { deleteCatalog } from "@/lib/store/slices/catalogSlice";
import DeleteConfirmationModal from "@/app/_components/DeleteConfirmDialog";

const CatalogList = ({ catalogs }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.catalog);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [viewSidebar, setViewSidebar] = useState(false);
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const [slug, setSlug] = useState(null);
  const [logicId, setLogicId] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState(null);

  const handleAddCatalog = () => {
    router.push("/seller/store/catalog/create");
  };

  // Define status styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          border: "border-yellow-100",
        };
      case "approved":
        return {
          bg: "bg-green-50",
          text: "text-green-800",
          border: "border-green-100",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-500",
          border: "border-red-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-800",
          border: "border-gray-100",
        };
    }
  };

  // Handle view products
  const handleViewProducts = (catalog) => {
    console.log("Viewing products for catalog:", catalog);

    setSelectedCatalog(catalog);
    setViewSidebar(true);
  };

  // Handle delete catalog
  const initiateDeleteCatalog = (catalog) => {
    setCatalogToDelete(catalog);
    setDeleteModalOpen(true);
  };

  const handleDeleteCatalog = async () => {
    if (!catalogToDelete) return;

    try {
      const result = await dispatch(
        deleteCatalog(catalogToDelete._id)
      ).unwrap();
      toast.success(result.message);
      setDeleteModalOpen(false);
      setCatalogToDelete(null);
    } catch (err) {
      toast.error(err || "Failed to delete catalog");
    }
  };

  // Handle edit catalog
  const handleEditCatalog = (catalogId) => {
    router.push(`/seller/store/catalog/update/${catalogId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle add product
  const handleAddProduct = (catalogId) => {
    setAddProductOpen(true);
    // router.push(`/seller/store/products/create?catalog=${catalogId}`);
  };

  const fetchProduct = async () => {
    try {
      let response;
      const params = new URLSearchParams({
        page: currentPage || 1,
        limit: itemsPerPage || 12,
        catalogId: selectedCatalog?._id,
      }).toString();

      response = await productApi.getProducts(token, params);

      const { products: productData, ...rest } = response;
      setProducts(productData);
      setProductStats(rest);
    } catch (error) {
      console.log(error);
    }
  };

  const onSuccess = () => {
    fetchProduct();
  };

  useEffect(() => {
    fetchProduct();
  }, [selectedCatalog]);

  console.log("delete modal -=============", deleteModalOpen);

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6">Catalogs</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Catalog Grid */}
        <div className="col-span-1 space-y-4">
          {/* Existing Catalogs */}
          {catalogs.map((catalog) => {
            const { bg, text, border } = getStatusStyles(catalog.status);
            const productCount =
              catalog.status === "approved"
                ? Math.floor(Math.random() * 20)
                : 0;

            return (
              <div
                key={catalog._id}
                className={`flex justify-between items-center rounded-lg w-full h-32 ${
                  catalog.status === "rejected" ? "bg-red-300/10" : "bg-white"
                } overflow-hidden shadow-sm transition-all ${border}`}
              >
                <div className="flex justify-start items-center gap-3 h-full">
                  {/* Catalog Image */}
                  <div className="relative w-32 !h-full bg-gray-100">
                    {catalog.image ? (
                      <Image
                        src={`${BASE_URL}${catalog.image}`}
                        alt={catalog.catalogName || "Catalog Image"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-8xl">
                          {catalog.catalogName
                            ? catalog.catalogName[0]?.toUpperCase() || "N/A"
                            : "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Catalog Info */}
                  <div className="py-4 flex flex-col justify-between gap-2 h-full">
                    <h3 className="font-medium text-[#001C44]">
                      {catalog?.catalogName}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {catalog?.categories?.slice(0, 2).map((category, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-[10px]  bg-[#001C44]/10 text-[#001C44] border-[#001C44]/20"
                        >
                          {category}
                        </Badge>
                      ))}
                      {catalog.categories?.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{catalog.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={` ${text} ${bg} capitalize`}
                      >
                        {catalog.status}
                      </Badge>

                      {catalog.status === "approved" && (
                        <Badge
                          variant="outline"
                          className=" bg-[#001C44] text-white"
                        >
                          {productCount}{" "}
                          {productCount === 1 ? "Product" : "Products"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="py-4 flex flex-col justify-between items-center h-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleViewProducts(catalog);
                      setSelectedCatalog(catalog);
                    }}
                    className="cursor-pointer"
                  >
                    <GalleryVerticalEnd className="size-4 rotate-90" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <EllipsisVertical className="size-4 " />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditCatalog(catalog._id)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddProduct(catalog._id)}
                        disabled={catalog.status !== "approved"}
                      >
                        <PackagePlus className="h-4 w-4 mr-2" /> Add Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => initiateDeleteCatalog(catalog)}
                        disabled={catalog.status === "pending"}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}

          {/* Add Catalog Card */}
          <div
            onClick={handleAddCatalog}
            className="border-2 border-dashed border-[#001C44]/30 rounded-lg flex flex-col items-center justify-center bg-[#001C44]/5 hover:bg-[#001C44]/10 cursor-pointer transition-colors h-32"
          >
            <div className="size-10 rounded-full bg-[#001C44]/10 flex items-center justify-center mb-1">
              <Plus className="size-6 text-[#001C44]" />
            </div>
            <h4 className="font-medium text-[#001C44]">Create New Catalog</h4>
            <p className="text-sm text-[#001C44]/70 mt-1 text-center">
              Add a new product catalog to your store
            </p>
          </div>
        </div>

        <div className="col-span-2 overflow-y-auto custom-shadow max-h-[100vh]">
          {viewSidebar ? (
            <>
              {slug ? (
                <div className="overflow-hidden">
                  <div className="origin-top-left scale-[0.83] w-[120%] lg:scale-[0.43]  lg:w-[200%] xl:scale-[0.53] xl:w-[150%] 2xl:scale-[0.63] 2xl:w-[140%] ">
                    <div className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSlug("");
                          setLogicId(false);
                        }}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <ProductDetail slug={slug} />
                    </div>
                  </div>
                </div>
              ) : (
                logicId && (
                  <div className="p-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSlug("");
                        setLogicId(false);
                      }}
                      className="mb-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500 text-lg">
                        No Product Selected
                      </p>
                    </div>
                  </div>
                )
              )}

              {!logicId && (
                <div className=" overflow-hidden">
                  <div
                    className=" bg-black/50"
                    onClick={() => setViewSidebar(false)}
                  />
                  <div className=" flex">
                    {/* <div className="relative w-screen max-w-md"> */}
                    <div className="relative w-full">
                      <div className="h-full flex flex-col bg-white shadow-xl">
                        <div className="flex-1 overflow-y-auto">
                          <div className="px-4 py-6 sm:px-6">
                            {addProductOpen ? (
                              <AddProductTem
                                setAddProductOpen={setAddProductOpen}
                                onSuccess={onSuccess}
                                catalogId={selectedCatalog?._id}
                              />
                            ) : (
                              <></>
                            )}

                            {!addProductOpen &&
                              // selectedCatalog?.status !== "approved" &&
                              (products.length > 0 ? (
                                <div>
                                  <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium text-[#001C44] capitalize">
                                      {selectedCatalog?.catalogName} :- Products
                                    </h3>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleAddProduct(selectedCatalog._id)
                                      }
                                      className="bg-[#001C44] hover:bg-[#001C44]/90"
                                    >
                                      <PackagePlus className="h-4 w-4 mr-2" />{" "}
                                      Add Product
                                    </Button>
                                  </div>

                                  {/* Product List - Dummy Data */}
                                  <div className="space-y-4">
                                    {/* {Array.from({ length: 3 }).map((_, idx) => ( */}
                                    {products.length > 0 &&
                                      products.map((item, idx) => (
                                        <div
                                          key={idx}
                                          onClick={() => {
                                            setSlug(item?.slug);
                                            setLogicId(true);
                                            // router.push(
                                            //   `?slug=${item?.slug}&logic=true`
                                            // );
                                            // setViewSidebar(false);
                                          }}
                                          className="flex items-start gap-4 p-3 border rounded-lg cursor-pointer"
                                        >
                                          <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                                            <Image
                                              src={item?.image[0]}
                                              alt={item?.title}
                                              width={128}
                                              height={128}
                                              className="object-cover"
                                            />
                                          </div>
                                          <div>
                                            <h4 className="font-medium">
                                              {item?.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                              ${item?.price}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                              SKU: {item?.sku}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <PackagePlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    No Products Available
                                  </h3>
                                  <p className="text-gray-500">
                                    This catalog needs to be approved before you
                                    can add products.
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>

                        {productStats?.total && !addProductOpen && (
                          <div className="mt-6">
                            <PaginationFooter
                              totalItems={productStats?.total}
                              itemsPerPage={itemsPerPage}
                              currentPage={currentPage}
                              onPageChange={handlePageChange}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">No Catalog Selected</p>
            </div>
          )}
        </div>
      </div>
      {deleteModalOpen && (
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCatalogToDelete(null);
          }}
          onConfirm={handleDeleteCatalog}
          itemName={catalogToDelete?.catalogName || "Unnamed Catalog"}
        />
      )}
    </div>
  );
};

export default CatalogList;
