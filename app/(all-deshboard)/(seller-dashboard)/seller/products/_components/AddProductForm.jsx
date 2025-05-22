"use client";
import MultiImageUploader from "@/app/_components/uploader/MultiImageUploader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryApi, productApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
// import ReactQuill from "react-quill-new";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Textarea } from "@/components/ui/textarea";

const AddProductForm = ({ open, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [submitFormLogic, setSubmitFormLogic] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]); // For files
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    sku: "",
    image: [],
    categories: [],
    tag: [],
    price: 0,
    salePrice: 0,
    attributes: [],
    variants: [
      {
        name: "base",
        value: "default",
        priceAdjustment: 0,
        skuSuffix: "",
        stock: 0,
        isDefault: true,
      },
    ],
    stock: 0,
    status: "show",
  });

  const variantTypes = [
    "size",
    "color",
    "wattage",
    "weight",
    "material",
    "custom",
  ];

  const { token } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];

    // Handle number fields for variants
    if (["priceAdjustment", "stock"].includes(field)) {
      newVariants[index][field] = value === "" ? "" : Number(value);
    } else {
      newVariants[index][field] = value;
    }

    setFormData({
      ...formData,
      variants: newVariants,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalUploadedImages = [...uploadedImages];
      if (selectedImages.length > 0) {
        finalUploadedImages = await uploadImages(selectedImages);
        setUploadedImages(finalUploadedImages);
      }

      if (finalUploadedImages.length > 0 || !requireImages) {
        const slug =
          formData.slug ||
          formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") + `-${Date.now()}`;

        const productData = {
          ...formData,
          slug,
          barcode: formData.sku,
          image: finalUploadedImages,
        };

        await productApi.createProduct({ ...productData }, token);
        toast.success("Product added successfully!");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Please upload at least one image");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (images) => {
    try {
      const uploadedUrls = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
          );

          const response = await fetch(
            process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("Failed to upload image");
          const data = await response.json();
          return data.secure_url;
        })
      );

      return uploadedUrls;
    } catch (error) {
      toast.error("Failed to upload images.");
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      const response = await categoryApi.getCategories();
      setAllCategory(response);
    })();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="min-w-[100vw] xl:min-w-[1200px] w-full h-[100vh] overflow-auto overflow-x-hidden">
        <SheetHeader className="bg-[#F2F2F2] px-10 py-5">
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Fill in the details to add a new product to your inventory.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 py-4 px-10 overflow-hidden"
        >
          <ScrollArea className=" h-[calc(100vh-220px)] pr-3">
            <Tabs defaultValue="basic" className="w-full mb-4">
              <TabsList className="grid grid-cols-2 bg-transparent w-[400px] mb-[-2px]">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none outline-none "
                >
                  Basic
                </TabsTrigger>
                <TabsTrigger
                  value="variant"
                  className="data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#DFB547] data-[state=active]:font-bold h-[40px] px-[40px] py-[4px] text-[15px] leading-[150%] tracking-[-1%] rounded-none outline-none"
                >
                  Variant
                </TabsTrigger>
              </TabsList>
              <div className="border-t"></div>
              <div className="grid grid-cols-1 gap-4">
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="flex items-start ">
                    <Label htmlFor="category" className="w-1/3">
                      Images
                    </Label>
                    <div className="w-2/3">
                      <MultiImageUploader
                        selectedImages={selectedImages}
                        setSelectedImages={setSelectedImages}
                        imagePreviews={imagePreviews}
                        setImagePreviews={setImagePreviews}
                      />
                    </div>
                  </div>

                  <div className="flex items-start ">
                    <Label htmlFor="title" className="w-1/3">
                      Product Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-2/3"
                    />
                  </div>

                  <div className="flex items-start">
                    <Label htmlFor="description" className="w-1/3">
                      Description
                    </Label>
                    {/* <ReactQuill
                      theme="snow"
                      className="w-2/3"
                      value={formData.description}
                      onChange={(value) => {
                        setFormData({ ...formData, description: value });
                      }}
                    /> */}
                    <Textarea
                      id="description"
                      name="description"
                      className="w-2/3 bg-[#F2F2F2] outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 shadow-none pl-4"
                      value={formData.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value })
                      }
                    />
                  </div>

                  <div className="flex items-start">
                    <Label htmlFor="sku" className="w-1/3">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      name="sku"
                      className="w-2/3"
                      value={formData.sku}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-start">
                    <Label htmlFor="category" className="w-1/3">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      className=""
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategory.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center">
                    <Label htmlFor="tag" className="w-1/3">
                      Tags
                    </Label>
                    <Input
                      id="tag"
                      name="tag"
                      className="w-2/3"
                      placeholder="Add a tag"
                      value={formData.tag.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tag: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>

                  {/* Price Fields */}
                  <div className="flex items-start">
                    <Label htmlFor="price" className="w-1/3">
                      Price *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      className="w-2/3"
                      value={formData.price || ""}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="flex items-start">
                    <Label htmlFor="salePrice" className="w-1/3">
                      Sale Price
                    </Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      className="w-2/3"
                      value={formData.salePrice || ""}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  {/* Attributes (Key-Value Pairs) */}
                  <div className="flex items-start">
                    <Label className="w-1/3">Attributes</Label>
                    <div className="w-2/3 space-y-2">
                      {formData.attributes?.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Attribute name"
                            value={attr.key}
                            onChange={(e) => {
                              const newAttributes = [...formData.attributes];
                              newAttributes[index].key = e.target.value;
                              setFormData({
                                ...formData,
                                attributes: newAttributes,
                              });
                            }}
                          />
                          <Input
                            placeholder="Value"
                            value={attr.value}
                            onChange={(e) => {
                              const newAttributes = [...formData.attributes];
                              newAttributes[index].value = e.target.value;
                              setFormData({
                                ...formData,
                                attributes: newAttributes,
                              });
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newAttributes = [...formData.attributes];
                              newAttributes.splice(index, 1);
                              setFormData({
                                ...formData,
                                attributes: newAttributes,
                              });
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            attributes: [
                              ...(formData.attributes || []),
                              { key: "", value: "" },
                            ],
                          });
                        }}
                        className="mt-2"
                      >
                        Add Attribute
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="variant">
                  <div className="flex items-start my-4">
                    <Label className="w-1/3">Variants</Label>
                    <div className="w-2/3 space-y-4">
                      {formData.variants.map((variant, index) => (
                        <div
                          key={index}
                          className="space-y-2 p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Select
                              value={variant.name}
                              onValueChange={(value) =>
                                handleVariantChange(index, "name", value)
                              }
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Variant type" />
                              </SelectTrigger>
                              <SelectContent>
                                {variantTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Value"
                              value={variant.value}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Price Adjustment</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={variant.priceAdjustment}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "priceAdjustment",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={variant.stock}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "stock",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="SKU Suffix"
                                value={variant.skuSuffix}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "skuSuffix",
                                    e.target.value
                                  )
                                }
                                className="w-32"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              {!variant.isDefault && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newVariants = [...formData.variants];
                                    newVariants.splice(index, 1);
                                    setFormData({
                                      ...formData,
                                      variants: newVariants,
                                    });
                                  }}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            variants: [
                              ...formData.variants,
                              {
                                name: "custom",
                                value: "",
                                priceAdjustment: 0,
                                skuSuffix: "",
                                stock: 0,
                                isDefault: false,
                              },
                            ],
                          });
                        }}
                        className="mt-2 w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Label htmlFor="status" className="w-1/3">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="show">Show</SelectItem>
                        <SelectItem value="hide">Hide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </ScrollArea>

          <SheetFooter className="p-0 m-0">
            <div className="px-10 py-4 border-t">
              <div className="flex gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddProductForm;
