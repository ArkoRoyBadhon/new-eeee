"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const Step1BasicInfo = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useFormContext();
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Sync preview with form values on mount and changes
  useEffect(() => {
    const formValues = getValues();
    if (formValues.storeLogoDataURL) {
      setPreviewLogo(formValues.storeLogoDataURL);
    }
    if (formValues.coverImageDataURL) {
      setPreviewCover(formValues.coverImageDataURL);
    }
  }, [getValues]);

  // Handle image file changes and previews
  const handleImageChange = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      setValue(field, file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result;
        setValue(`${field}DataURL`, dataURL);
        setValue(`${field}Name`, file.name);
        if (field === "storeLogo") {
          setPreviewLogo(dataURL);
        } else {
          setPreviewCover(dataURL);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setValue(field, null);
      setValue(`${field}DataURL`, null);
      setValue(`${field}Name`, null);
      if (field === "storeLogo") {
        setPreviewLogo(null);
      } else {
        setPreviewCover(null);
      }
    }
  };

  return (
    <>
      <CardHeader className="px-0 mb-2">
        <CardTitle className="text-2xl font-semibold mb-2">
          Business Profile
        </CardTitle>
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Store Name */}
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name *</Label>
          <Input
            id="storeName"
            placeholder="e.g., 'Mansa Industrial Supplies'"
            {...register("storeName")}
          />
          {errors.storeName && (
            <p className="text-red-500 text-[12px]">{errors.storeName.message}</p>
          )}
        </div>

        {/* Store Logo and Cover Image */}
        <div className="flex space-x-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="storeLogo">Store Logo *</Label>
            <Input
              id="storeLogo"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handleImageChange(e, "storeLogo")}
              ref={logoInputRef}
              className="hidden"
            />
            <div
              className="mt-2 border border-dashed p-2 h-32 flex items-center justify-center cursor-pointer"
              onClick={() => logoInputRef.current?.click()}
            >
              {previewLogo ? (
                <Image
                  src={previewLogo}
                  alt="Store Logo Preview"
                  width={200}
                  height={200}
                  className="object-contain h-full w-auto"
                />
              ) : (
                <p className="text-sm text-gray-500">min. 500x500px, PNG/JPG</p>
              )}
            </div>
            {errors.storeLogo && (
              <p className="text-red-500 text-[12px]">{errors.storeLogo.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handleImageChange(e, "coverImage")}
              ref={coverInputRef}
              className="hidden"
            />
            <div
              className="mt-2 border border-dashed p-2 h-32 flex items-center justify-center cursor-pointer"
              onClick={() => coverInputRef.current?.click()}
            >
              {previewCover ? (
                <Image
                  src={previewCover}
                  alt="Cover Image Preview"
                  width={200}
                  height={200}
                  className="object-contain h-full w-auto"
                />
              ) : (
                <p className="text-sm text-gray-500">Upload Cover Image</p>
              )}
            </div>
            {errors.coverImage && (
              <p className="text-red-500 text-[12px]">{errors.coverImage.message}</p>
            )}
          </div>
        </div>

        {/* Company Website and Preferred Language */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              id="companyWebsite"
              placeholder="e.g., 'https://mansa.com'"
              {...register("companyWebsite")}
            />
            {errors.companyWebsite && (
              <p className="text-red-500 text-[12px]">{errors.companyWebsite.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language *</Label>
            <Select
              onValueChange={(value) => setValue("preferredLanguage", value)}
              value={watch("preferredLanguage") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select from List of Languages: English, French" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredLanguage && (
              <p className="text-red-500 text-[12px]">{errors.preferredLanguage.message}</p>
            )}
          </div>
        </div>

        {/* Store Description */}
        <div className="space-y-2">
          <Label htmlFor="storeDescription">Store Description</Label>
          <Input
            id="storeDescription"
            placeholder="Store Description (min. 100 characters)"
            {...register("storeDescription")}
          />
          {errors.storeDescription && (
            <p className="text-red-500 text-[12px]">{errors.storeDescription.message}</p>
          )}
        </div>

        {/* ABBF Membership */}
        <div className="space-y-2">
          <Label htmlFor="abbfMembership">ABBF membership status: *</Label>
          <RadioGroup
            onValueChange={(value) => setValue("abbfMembership", value)}
            value={watch("abbfMembership") || ""}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="abbf-yes" />
              <Label htmlFor="abbf-yes">YES</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="abbf-no" />
              <Label htmlFor="abbf-no">NO</Label>
            </div>
          </RadioGroup>
          {errors.abbfMembership && (
            <p className="text-red-500 text-[12px]">{errors.abbfMembership.message}</p>
          )}
        </div>
      </CardContent>
    </>
  );
};

export default Step1BasicInfo;