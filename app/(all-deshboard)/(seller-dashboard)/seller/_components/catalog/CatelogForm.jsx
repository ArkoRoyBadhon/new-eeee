"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  createCatalog,
  editCatalog,
  fetchCatalogs,
} from "@/lib/store/slices/catalogSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";

const CatalogForm = ({ mode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { catalogId } = useParams(); // Get catalogId for edit mode
  const { catalogs, loading, error } = useSelector((state) => state.catalog);

  // Find the catalog to edit (if in edit mode)
  const catalog =
    mode === "edit" ? catalogs.find((cat) => cat._id === catalogId) : null;

  // State for form data and tracking modified fields
  const [formData, setFormData] = useState({
    catalogName: "",
    subCategories: [],
    categories: [],
    image: null,
  });
  const [originalData, setOriginalData] = useState({}); // To track original values for edit mode
  const [modifiedFields, setModifiedFields] = useState(new Set()); // Track which fields have been modified
  const [imagePreview, setImagePreview] = useState(null); // Separate state for image preview
  const [openSubCategories, setOpenSubCategories] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const fileInputRef = useRef(null);

  const allCategories = [
    "Machinery",
    "Electronics",
    "Industrial Tools",
    "Safety Equipment",
    "Hardware",
    "Power Tools",
    "Hand Tools",
    "Measuring Tools",
    "Electrical",
    "Plumbing",
  ];

  // Load catalog data for edit mode or initialize for create mode
  useEffect(() => {
    if (mode === "edit") {
      if (!catalog) {
        dispatch(fetchCatalogs()).then(() => {
          const updatedCatalog = catalogs.find((cat) => cat._id === catalogId);
          if (!updatedCatalog) {
            toast.error("Catalog not found");
            router.push("/seller/store");
          }
        });
      } else {
        setFormData({
          catalogName: catalog.catalogName,
          subCategories: catalog.subCategories,
          categories: catalog.categories,
          image: null, // We'll manage the image separately via imagePreview
        });
        setOriginalData({
          catalogName: catalog.catalogName,
          subCategories: [...catalog.subCategories],
          categories: [...catalog.categories],
          image: catalog.image,
        });
        // Set initial image preview for edit mode
        setImagePreview(`${BASE_URL}${catalog.image}`);
      }
    }
  }, [catalog, dispatch, catalogs, catalogId, router, mode]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle input changes and track modified fields (for edit mode)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (mode === "edit") {
      // Mark the field as modified if it's different from the original value
      if (name === "image") {
        if (newValue !== null) {
          setModifiedFields((prev) => new Set([...prev, name]));
        }
      } else if (originalData[name] !== newValue) {
        setModifiedFields((prev) => new Set([...prev, name]));
      } else {
        setModifiedFields((prev) => {
          const updated = new Set(prev);
          updated.delete(name);
          return updated;
        });
      }
    }
  };

  // Handle category/subcategory selection and track modifications
  const handleSelect = (name, value) => {
    const currentValues = formData[name];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFormData({
      ...formData,
      [name]: newValues,
    });

    if (mode === "edit") {
      // Compare with original data to track modifications
      const originalValues = originalData[name];
      const isModified =
        newValues.length !== originalValues.length ||
        newValues.some((val, idx) => val !== originalValues[idx]);
      if (isModified) {
        setModifiedFields((prev) => new Set([...prev, name]));
      } else {
        setModifiedFields((prev) => {
          const updated = new Set(prev);
          updated.delete(name);
          return updated;
        });
      }
    }
  };

  const handleRemoveSelected = (name, value) => {
    const newValues = formData[name].filter((item) => item !== value);
    setFormData({
      ...formData,
      [name]: newValues,
    });

    if (mode === "edit") {
      // Compare with original data
      const originalValues = originalData[name];
      const isModified =
        newValues.length !== originalValues.length ||
        newValues.some((val, idx) => val !== originalValues[idx]);
      if (isModified) {
        setModifiedFields((prev) => new Set([...prev, name]));
      } else {
        setModifiedFields((prev) => {
          const updated = new Set(prev);
          updated.delete(name);
          return updated;
        });
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke the previous blob URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      // Set the new image in formData and create a preview URL
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
      if (mode === "edit") {
        setModifiedFields((prev) => new Set([...prev, "image"]));
      }
    }
  };

  const removeImage = () => {
    // Revoke the blob URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    // Clear the image from formData and reset the preview
    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview(null);
    if (mode === "edit") {
      setModifiedFields((prev) => new Set([...prev, "image"]));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate submission based on rejection reasons (for edit mode)
  const canSubmit = () => {
    if (mode !== "edit" || catalog?.status !== "rejected") return true;

    const rejectedFields = catalog.rejectionReasons.map(
      (reason) => reason.field
    );
    return rejectedFields.every((field) => modifiedFields.has(field));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (
      !formData.catalogName ||
      formData.subCategories.length === 0 ||
      formData.categories.length === 0 ||
      (!formData.image && (mode !== "edit" || !catalog?.image))
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (mode === "edit" && !canSubmit()) {
      toast.error(
        "Please modify the fields marked as rejected before submitting"
      );
      return;
    }

    const action = mode === "edit" ? editCatalog : createCatalog;
    const payload =
      mode === "edit"
        ? {
            catalogId: catalogId,
            catalogName: formData.catalogName,
            categories: formData.categories,
            subCategories: formData.subCategories,
            image: formData.image,
          }
        : formData;

    dispatch(action(payload))
      .unwrap()
      .then(() => {
        toast.success(
          mode === "edit"
            ? "Catalog updated and submitted for review!"
            : "Catalog submitted for review!"
        );
        setFormData({
          catalogName: "",
          subCategories: [],
          categories: [],
          image: null,
        });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        router.push("/seller/store");
      })
      .catch((err) => {
        toast.error(
          err || `Failed to ${mode === "edit" ? "update" : "create"} catalog`
        );
      });
  };

  // Get rejection reason for a specific field (for edit mode)
  const getRejectionReason = (field) => {
    if (mode !== "edit" || catalog?.status !== "rejected") return null;
    const reason = catalog.rejectionReasons.find((r) => r.field === field);
    return reason ? reason.reason : null;
  };

  if (mode === "edit" && !catalog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-[100vh]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            {mode === "edit" ? "Edit Catalog" : "Catalog Creation"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Catalog Name */}
            <div>
              <Label className="block mb-2">
                Catalog Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="catalogName"
                placeholder='e.g., "2024 Industrial Tools"'
                value={formData.catalogName}
                onChange={handleChange}
                className="w-full"
              />
              {getRejectionReason("catalogName") && (
                <p className="text-red-500 text-sm mt-1">
                  {getRejectionReason("catalogName")}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categories */}
              <div>
                <Label className="block mb-2">
                  Select Categories <span className="text-red-500">*</span>
                </Label>
                <Popover open={openCategories} onOpenChange={setOpenCategories}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategories}
                      className="w-full justify-between"
                    >
                      {formData.categories.length > 0
                        ? `${formData.categories.length} selected`
                        : "Select categories..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {allCategories.map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={() =>
                              handleSelect("categories", category)
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categories.includes(category)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSelected("categories", category)
                          }
                          className="ml-1 rounded-full outline-none hover:bg-accent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {getRejectionReason("categories") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getRejectionReason("categories")}
                  </p>
                )}
              </div>

              {/* Sub-Categories */}
              <div>
                <Label className="block mb-2">
                  Select Sub-Categories <span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={openSubCategories}
                  onOpenChange={setOpenSubCategories}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSubCategories}
                      className="w-full justify-between"
                    >
                      {formData.subCategories.length > 0
                        ? `${formData.subCategories.length} selected`
                        : "Select sub-categories..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search sub-categories..." />
                      <CommandEmpty>No sub-category found.</CommandEmpty>
                      <CommandGroup>
                        {allCategories.map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={() =>
                              handleSelect("subCategories", category)
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.subCategories.includes(category)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.subCategories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSelected("subCategories", category)
                          }
                          className="ml-1 rounded-full outline-none hover:bg-accent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {getRejectionReason("subCategories") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getRejectionReason("subCategories")}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="w-1/2">
              <Label className="block mb-2">
                Image <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative group border-4 bg-amber-300 rounded-md">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="h-32 w-[100%] object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-[100%]">
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="h-32 w-[100%] border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                    >
                      <ImagePlus className="h-6 w-6 mb-1" />
                      <span className="text-xs">Upload</span>
                    </button>
                    <div className="text-center">
                      <p className="text-[12px] text-gray-500">
                        min. 500×500px, PNG/JPG
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {getRejectionReason("image") && (
                <p className="text-red-500 text-sm mt-1">
                  {getRejectionReason("image")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-[#001C44] hover:bg-[#001C44]/90"
                disabled={loading || !canSubmit()}
              >
                {loading
                  ? mode === "edit"
                    ? "Updating..."
                    : "Submitting..."
                  : mode === "edit"
                  ? "Update"
                  : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogForm;