"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray } from "react-hook-form";
import { FileText, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

const Step3BusinessType = ({ saveFormData }) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalDocuments",
  });
  const [filePreviews, setFilePreviews] = useState({});

  // Sync filePreviews with form values on mount and when form data changes
  useEffect(() => {
    const formValues = getValues();
    const newPreviews = {};

    // Sync required documents
    const requiredDocuments = [
      "businessRegistration",
      "taxId",
      "proofOfAddress",
      "ownerIdentification",
    ];
    requiredDocuments.forEach((doc) => {
      if (formValues[`${doc}DataURL`]) {
        newPreviews[doc] = {
          url: formValues[`${doc}DataURL`],
          name: formValues[`${doc}Name`] || doc,
          type: formValues[doc] instanceof File ? formValues[doc].type : "application/pdf",
        };
      }
    });

    // Sync additional documents
    if (formValues.additionalDocuments) {
      formValues.additionalDocuments.forEach((doc, index) => {
        if (doc.fileDataURL) {
          newPreviews[`additional-${index}`] = {
            url: doc.fileDataURL,
            name: doc.fileName || `additionalDoc_${index}`,
            type: doc.file instanceof File ? doc.file.type : "application/pdf",
          };
        }
      });
    }

    setFilePreviews(newPreviews);
  }, [getValues]);

  // Handle file previews for new uploads
  const handleFileChange = (fieldName, file) => {
    if (file) {
      setValue(fieldName, file);
      const reader = new FileReader();
      reader.onload = () => {
        setValue(`${fieldName}DataURL`, reader.result);
        setValue(`${fieldName}Name`, file.name);
        setFilePreviews((prev) => ({
          ...prev,
          [fieldName]: {
            url: reader.result,
            name: file.name,
            type: file.type,
          },
        }));
        if (saveFormData) {
          const currentData = getValues();
          saveFormData(currentData);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setValue(fieldName, null);
      setValue(`${fieldName}DataURL`, null);
      setValue(`${fieldName}Name`, null);
      setFilePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
      if (saveFormData) {
        const currentData = getValues();
        saveFormData(currentData);
      }
    }
  };

  const handleAdditionalFileChange = (index, file) => {
    if (file) {
      setValue(`additionalDocuments.${index}.file`, file);
      const reader = new FileReader();
      reader.onload = () => {
        setValue(`additionalDocuments.${index}.fileDataURL`, reader.result);
        setValue(`additionalDocuments.${index}.fileName`, file.name);
        setFilePreviews((prev) => ({
          ...prev,
          [`additional-${index}`]: {
            url: reader.result,
            name: file.name,
            type: file.type,
          },
        }));
        if (saveFormData) {
          const currentData = getValues();
          saveFormData(currentData);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setValue(`additionalDocuments.${index}.file`, null);
      setValue(`additionalDocuments.${index}.fileDataURL`, null);
      setValue(`additionalDocuments.${index}.fileName`, null);
      setFilePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[`additional-${index}`];
        return newPreviews;
      });
      if (saveFormData) {
        const currentData = getValues();
        saveFormData(currentData);
      }
    }
  };

  const removeFile = (fieldName) => {
    setValue(fieldName, null);
    setValue(`${fieldName}DataURL`, null);
    setValue(`${fieldName}Name`, null);
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    if (saveFormData) {
      const currentData = getValues();
      saveFormData(currentData);
    }
  };

  const removeAdditionalFile = (index) => {
    setValue(`additionalDocuments.${index}.file`, null);
    setValue(`additionalDocuments.${index}.fileDataURL`, null);
    setValue(`additionalDocuments.${index}.fileName`, null);
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`additional-${index}`];
      return newPreviews;
    });
    if (saveFormData) {
      const currentData = getValues();
      saveFormData(currentData);
    }
  };

  const handleRemoveDocument = (index) => {
    remove(index);
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`additional-${index}`];
      return newPreviews;
    });
    if (saveFormData) {
      const currentData = getValues();
      saveFormData(currentData);
    }
  };

  const requiredDocuments = [
    {
      name: "businessRegistration",
      label: "Business Registration*",
      description: "Certificate of incorporation or similar document.",
    },
    {
      name: "taxId",
      label: "Tax ID*",
      description: "TIN, EIN (in the U.S.), or equivalent.",
    },
    {
      name: "proofOfAddress",
      label: "Proof of Address*",
      description: "Recent utility bills or bank statements.",
    },
    {
      name: "ownerIdentification",
      label: "Owner Identification*",
      description: "Passports or IDs for beneficial owners.",
    },
  ];

  const businessSectorOptions = [
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "construction", label: "Construction" },
    { value: "hospitality", label: "Hospitality" },
    { value: "agriculture", label: "Agriculture" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ];

  return (
    <>
      <CardHeader className="px-0 mb-2">
        <CardTitle className="text-2xl font-semibold">Business Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        {/* Legal Status and Nature of Business */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legalStatus">Legal Status *</Label>
            <Select
              onValueChange={(value) => setValue("legalStatus", value)}
              value={watch("legalStatus") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sole">Sole Proprietorship</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
              </SelectContent>
            </Select>
            {errors.legalStatus && (
              <p className="text-red-500 text-[12px]">{errors.legalStatus.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="natureOfBusiness">Nature of Business *</Label>
            <Input
              id="natureOfBusiness"
              placeholder="e.g., Industrial Supplies"
              {...register("natureOfBusiness")}
            />
            {errors.natureOfBusiness && (
              <p className="text-red-500 text-[12px]">{errors.natureOfBusiness.message}</p>
            )}
          </div>
        </div>

        {/* Business Sector and Certifications */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessSector">Business Sector *</Label>
            <Select
              onValueChange={(value) => setValue("businessSector", value)}
              value={watch("businessSector") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business sector" />
              </SelectTrigger>
              <SelectContent>
                {businessSectorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessSector && (
              <p className="text-red-500 text-[12px]">{errors.businessSector.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="certifications">International Certifications *</Label>
            <Select
              onValueChange={(value) => setValue("certifications", value)}
              value={watch("certifications") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select certification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iso">ISO</SelectItem>
                <SelectItem value="ce">CE</SelectItem>
                <SelectItem value="fda">FDA</SelectItem>
                <SelectItem value="gmp">GMP</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            {errors.certifications && (
              <p className="text-red-500 text-[12px]">{errors.certifications.message}</p>
            )}
          </div>
        </div>

        {/* Business Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Business Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {requiredDocuments.map((doc) => (
              <div key={doc.name} className="space-y-3 grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor={doc.name}>{doc.label}</Label>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
                {filePreviews[doc.name] ? (
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      {filePreviews[doc.name].type?.includes("image") ? (
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                      <span className="text-sm">{filePreviews[doc.name].name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(doc.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500 text-[12px]" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor={doc.name}
                      className="flex flex-col items-center justify-center w-full h-[60px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">PDF, JPG, or PNG</p>
                      </div>
                      <Input
                        id={doc.name}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(doc.name, e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                )}
                {errors[doc.name] && (
                  <p className="text-sm text-red-500 text-[12px]">{errors[doc.name].message}</p>
                )}
              </div>
            ))}

            {/* Additional Documents */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Additional Records</Label>
                <p className="text-sm text-muted-foreground">
                  Partnership deeds, board resolutions, or financial statements,
                  depending on the business type.
                </p>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 border p-4 rounded-lg grid grid-cols-7 gap-4 items-center"
                >
                  <div className="space-y-2 col-span-3">
                    <Label>Document Name</Label>
                    <Input
                      {...register(`additionalDocuments.${index}.name`)}
                      placeholder="e.g., Partnership Deed"
                      className="h-[60px]"
                    />
                    {errors.additionalDocuments?.[index]?.name && (
                      <p className="text-sm text-red-500 text-[12px]">
                        {errors.additionalDocuments[index].name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 col-span-3">
                    <Label>File</Label>
                    {filePreviews[`additional-${index}`] ? (
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          {filePreviews[`additional-${index}`].type?.includes("image") ? (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-500" />
                          )}
                          <span className="text-sm">{filePreviews[`additional-${index}`].name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalFile(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500 text-[12px]" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor={`additionalDocuments.${index}.file`}
                          className="flex flex-col items-center justify-center w-full h-[60px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-gray-500">PDF, JPG, or PNG</p>
                          </div>
                          <Input
                            id={`additionalDocuments.${index}.file`}
                            type="file"
                            className="hidden"
                            onChange={(e) => handleAdditionalFileChange(index, e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>
                    )}
                    {errors.additionalDocuments?.[index]?.file && (
                      <p className="text-sm text-red-500 text-[12px]">
                        {errors.additionalDocuments[index].file.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    className="px-3 py-1"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  append({ name: "", file: null, fileDataURL: null, fileName: null })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};

export default Step3BusinessType;