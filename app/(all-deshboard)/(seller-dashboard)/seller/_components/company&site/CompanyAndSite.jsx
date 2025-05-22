"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  fetchStoreStatus,
  fetchStoreDetails,
  updateStore,
} from "@/lib/store/slices/storeSetupSlice";
import { BASE_URL } from "@/lib/api";
import {
  FileText,
  Globe,
  Mail,
  Phone,
  MapPin,
  Banknote,
  Truck,
  ShieldCheck,
  Edit,
  Save,
  X,
  Plus,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const CompanyAndSite = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, store, loading, error, editableFields, rejectionReasons } =
    useSelector((state) => state.storeSetup);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    storeLogo: "",
    coverImage: "",
    companyWebsite: "",
    preferredLanguage: "",
    storeDescription: "",
    abbfMembership: "",
    businessEmail: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    contactPerson: {
      name: "",
      designation: "",
      mobile: "",
      email: "",
    },
    legalStatus: "",
    natureOfBusiness: "",
    businessSector: "",
    certifications: "",
    businessDetails: {
      businessRegistration: "",
      taxId: "",
      proofOfAddress: "",
      ownerIdentification: "",
      additionalDocuments: [],
    },
    bankDetails: {
      bankName: "",
      accountNumber: "",
      swiftCode: "",
      currency: "",
      isPrimary: "",
    },
    paymentTerms: {
      upfront: "",
      onDelivery: "",
      acceptedCurrencies: [],
      customTerms: [],
    },
    shipping: {
      regions: [],
      carriers: [],
    },
    policies: {
      terms: false,
      privacy: false,
      conditions: false,
      authentic: false,
    },
  });
  const [fileUploads, setFileUploads] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user && token) {
      dispatch(fetchStoreStatus());
      if (status === "approved" || status === "rejected") {
        dispatch(fetchStoreDetails());
      }
    }
  }, [user, token, dispatch, status]);

  useEffect(() => {
    if (store) {
      setFormData({
        storeName: store.storeName || "",
        storeLogo: store.storeLogo || "",
        coverImage: store.coverImage || "",
        companyWebsite: store.companyWebsite || "",
        preferredLanguage: store.preferredLanguage || "",
        storeDescription: store.storeDescription || "",
        abbfMembership: store.abbfMembership || "",
        businessEmail: store.businessEmail || "",
        phoneNumber: store.phoneNumber || "",
        addressLine1: store.addressLine1 || "",
        addressLine2: store.addressLine2 || "",
        city: store.city || "",
        postalCode: store.postalCode || "",
        country: store.country || "",
        contactPerson: {
          name: store.contactPerson?.name || "",
          designation: store.contactPerson?.designation || "",
          mobile: store.contactPerson?.mobile || "",
          email: store.contactPerson?.email || "",
        },
        legalStatus: store.legalStatus || "",
        natureOfBusiness: store.natureOfBusiness || "",
        businessSector: store.businessSector || "",
        certifications: store.certifications || "",
        businessDetails: {
          businessRegistration:
            store.businessDetails?.businessRegistration || "",
          taxId: store.businessDetails?.taxId || "",
          proofOfAddress: store.businessDetails?.proofOfAddress || "",
          ownerIdentification: store.businessDetails?.ownerIdentification || "",
          additionalDocuments: store.businessDetails?.additionalDocuments || [],
        },
        bankDetails: {
          bankName: store.bankDetails?.bankName || "",
          accountNumber: store.bankDetails?.accountNumber || "",
          swiftCode: store.bankDetails?.swiftCode || "",
          currency: store.bankDetails?.currency || "",
          isPrimary: store.bankDetails?.isPrimary || "",
        },
        paymentTerms: {
          upfront: store.paymentTerms?.upfront || "",
          onDelivery: store.paymentTerms?.onDelivery || "",
          acceptedCurrencies: store.paymentTerms?.acceptedCurrencies || [],
          customTerms: store.paymentTerms?.customTerms || [],
        },
        shipping: {
          regions: store.shipping?.regions || [],
          carriers: store.shipping?.carriers || [],
        },
        policies: {
          terms: store.policies?.terms || false,
          privacy: store.policies?.privacy || false,
          conditions: store.policies?.conditions || false,
          authentic: store.policies?.authentic || false,
        },
      });
      setFilePreviews({
        storeLogo: store.storeLogo ? `${BASE_URL}${store.storeLogo}` : "",
        coverImage: store.coverImage ? `${BASE_URL}${store.coverImage}` : "",
        businessRegistration: store.businessDetails?.businessRegistration
          ? `${BASE_URL}${store.businessDetails.businessRegistration}`
          : "",
        taxId: store.businessDetails?.taxId
          ? `${BASE_URL}${store.businessDetails.taxId}`
          : "",
        proofOfAddress: store.businessDetails?.proofOfAddress
          ? `${BASE_URL}${store.businessDetails.proofOfAddress}`
          : "",
        ownerIdentification: store.businessDetails?.ownerIdentification
          ? `${BASE_URL}${store.businessDetails.ownerIdentification}`
          : "",
      });
    }
  }, [store]);

  const handleVerifyNow = () => {
    router.push("/seller/store/store-setup?step=1");
  };

  const handleCreateCatalog = () => {
    router.push("/seller/catalog/create");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setFormErrors({});
  };

  const handleUpdateInfo = () => {
    setIsEditing(true);
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      storeName: store?.storeName || "",
      storeLogo: store?.storeLogo || "",
      coverImage: store?.coverImage || "",
      companyWebsite: store?.companyWebsite || "",
      preferredLanguage: store?.preferredLanguage || "",
      storeDescription: store?.storeDescription || "",
      abbfMembership: store?.abbfMembership || "",
      businessEmail: store?.businessEmail || "",
      phoneNumber: store?.phoneNumber || "",
      addressLine1: store?.addressLine1 || "",
      addressLine2: store?.addressLine2 || "",
      city: store?.city || "",
      postalCode: store?.postalCode || "",
      country: store?.country || "",
      contactPerson: {
        name: store?.contactPerson?.name || "",
        designation: store?.contactPerson?.designation || "",
        mobile: store?.contactPerson?.mobile || "",
        email: store?.contactPerson?.email || "",
      },
      legalStatus: store?.legalStatus || "",
      natureOfBusiness: store?.natureOfBusiness || "",
      businessSector: store?.businessSector || "",
      certifications: store?.certifications || "",
      businessDetails: {
        businessRegistration:
          store?.businessDetails?.businessRegistration || "",
        taxId: store?.businessDetails?.taxId || "",
        proofOfAddress: store?.businessDetails?.proofOfAddress || "",
        ownerIdentification: store?.businessDetails?.ownerIdentification || "",
        additionalDocuments: store?.businessDetails?.additionalDocuments || [],
      },
      bankDetails: {
        bankName: store?.bankDetails?.bankName || "",
        accountNumber: store?.bankDetails?.accountNumber || "",
        swiftCode: store?.bankDetails?.swiftCode || "",
        currency: store?.bankDetails?.currency || "",
        isPrimary: store?.bankDetails?.isPrimary || "",
      },
      paymentTerms: {
        upfront: store?.paymentTerms?.upfront || "",
        onDelivery: store?.paymentTerms?.onDelivery || "",
        acceptedCurrencies: store?.paymentTerms?.acceptedCurrencies || [],
        customTerms: store?.paymentTerms?.customTerms || [],
      },
      shipping: {
        regions: store?.shipping?.regions || [],
        carriers: store?.shipping?.carriers || [],
      },
      policies: {
        terms: store?.policies?.terms || false,
        privacy: store?.policies?.privacy || false,
        conditions: store?.policies?.conditions || false,
        authentic: store?.policies?.authentic || false,
      },
    });
    setFileUploads({});
    setFilePreviews({
      storeLogo: store?.storeLogo ? `${BASE_URL}${store.storeLogo}` : "",
      coverImage: store?.coverImage ? `${BASE_URL}${store.coverImage}` : "",
      businessRegistration: store?.businessDetails?.businessRegistration
        ? `${BASE_URL}${store.businessDetails.businessRegistration}`
        : "",
      taxId: store?.businessDetails?.taxId
        ? `${BASE_URL}${store.businessDetails.taxId}`
        : "",
      proofOfAddress: store?.businessDetails?.proofOfAddress
        ? `${BASE_URL}${store.businessDetails.proofOfAddress}`
        : "",
      ownerIdentification: store?.businessDetails?.ownerIdentification
        ? `${BASE_URL}${store.businessDetails.ownerIdentification}`
        : "",
    });
    setFormErrors({});
  };

  const handleInputChange = (e, field, subfield, index) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (index !== undefined) {
        // Handle array fields
        const updatedArray = [...prev[field][subfield]];
        updatedArray[index] = value;
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: updatedArray,
          },
        };
      } else if (subfield) {
        // Handle nested objects
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: type === "checkbox" ? checked : value,
          },
        };
      } else {
        // Handle top-level fields
        return {
          ...prev,
          [field]: type === "checkbox" ? checked : value,
        };
      }
    });
    setFormErrors((prev) => ({
      ...prev,
      [field]: "",
      [`${field}.${subfield}`]: "",
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFileUploads((prev) => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews((prev) => ({ ...prev, [field]: previewUrl }));
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayAdd = (field, subfield, defaultValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: [...prev[field][subfield], defaultValue],
      },
    }));
  };

  const handleArrayRemove = (field, subfield, index) => {
    setFormData((prev) => {
      const updatedArray = prev[field][subfield].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: updatedArray,
        },
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = editableFields.filter((field) =>
      [
        "storeName",
        "preferredLanguage",
        "abbfMembership",
        "businessEmail",
        "phoneNumber",
        "addressLine1",
        "city",
        "postalCode",
        "country",
        "contactPerson.name",
        "contactPerson.designation",
        "contactPerson.mobile",
        "contactPerson.email",
        "legalStatus",
        "natureOfBusiness",
        "businessSector",
        "certifications",
        "bankDetails.bankName",
        "bankDetails.accountNumber",
        "bankDetails.swiftCode",
        "bankDetails.currency",
        "bankDetails.isPrimary",
        "paymentTerms.upfront",
        "paymentTerms.onDelivery",
        "policies.terms",
        "policies.privacy",
        "policies.conditions",
        "policies.authentic",
      ].includes(field)
    );

    requiredFields.forEach((field) => {
      const [parent, child] = field.split(".");
      const value = child ? formData[parent][child] : formData[field];
      if (value === "" || value === false || value === undefined) {
        errors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .trim()} is required`;
      }
    });

    // Validate paymentTerms percentages
    if (
      editableFields.some((f) =>
        [
          "paymentTerms.upfront",
          "paymentTerms.onDelivery",
          "paymentTerms.customTerms",
        ].includes(f)
      )
    ) {
      const upfront = parseFloat(formData.paymentTerms.upfront) || 0;
      const onDelivery = parseFloat(formData.paymentTerms.onDelivery) || 0;
      const customTermsSum = formData.paymentTerms.customTerms.reduce(
        (sum, term) => sum + (parseFloat(term.percentage) || 0),
        0
      );
      const total = upfront + onDelivery + customTermsSum;
      if (total !== 100) {
        errors["paymentTerms"] = "Payment terms percentages must sum to 100%";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const form = new FormData();
    const storeData = {};

    editableFields.forEach((field) => {
      const [parent, child] = field.split(".");
      if (child) {
        if (
          formData[parent][child] !== undefined &&
          formData[parent][child] !== (store[parent]?.[child] || "")
        ) {
          storeData[parent] = storeData[parent] || {};
          storeData[parent][child] = formData[parent][child];
        }
      } else {
        if (
          formData[field] !== undefined &&
          formData[field] !== (store[field] || "")
        ) {
          storeData[field] = formData[field];
        }
      }
    });

    if (Object.keys(storeData).length > 0) {
      form.append("storeData", JSON.stringify(storeData));
    }

    [
      "storeLogo",
      "coverImage",
      "businessDetails.businessRegistration",
      "businessDetails.taxId",
      "businessDetails.proofOfAddress",
      "businessDetails.ownerIdentification",
    ].forEach((field) => {
      const [parent, child] = field.split(".");
      if (editableFields.includes(field) && fileUploads[child || field]) {
        form.append(child || field, fileUploads[child || field]);
      }
    });

    try {
      await dispatch(updateStore(form)).unwrap();
      setIsEditing(false);
      setFileUploads({});
      setFilePreviews({});
    } catch (error) {
      setFormErrors({ general: error || "Failed to update store" });
    }
  };

  const getRejectionReason = (field) => {
    const reason = rejectionReasons.find((r) => r.field === field);
    return reason ? reason.reason : "";
  };

  const renderField = (field) => {
    const [parent, child] = field.split(".");
    const isRejected = rejectionReasons.some((r) => r.field === field);
    const errorClass = isRejected ? "border-red-500" : "";

    // File fields
    if (
      [
        "storeLogo",
        "coverImage",
        "businessDetails.businessRegistration",
        "businessDetails.taxId",
        "businessDetails.proofOfAddress",
        "businessDetails.ownerIdentification",
      ].includes(field)
    ) {
      const fieldName = child || field;
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={fieldName}>
            {fieldName.replace(/([A-Z])/g, " $1").trim()}
          </Label>
          {filePreviews[fieldName] && (
            <div className="mt-2 mb-2">
              <Image
                src={filePreviews[fieldName]}
                alt={`${fieldName} Preview`}
                width={fieldName === "storeLogo" ? 100 : 200}
                height={100}
                className="object-contain"
              />
            </div>
          )}
          <Input
            id={fieldName}
            type="file"
            accept={
              fieldName.includes("Image")
                ? "image/*"
                : "image/*,application/pdf"
            }
            onChange={(e) => handleFileChange(e, fieldName)}
            className={errorClass}
          />
          {isRejected && (
            <p className="text-red-500 text-sm mt-1">
              {getRejectionReason(field)}
            </p>
          )}
          {formErrors[field] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
          )}
        </div>
      );
    }

    // Array fields
    if (
      [
        "paymentTerms.acceptedCurrencies",
        "shipping.regions",
        "shipping.carriers",
      ].includes(field)
    ) {
      const items = formData[parent][child];
      return (
        <div key={field} className="space-y-2">
          <Label>{child.replace(/([A-Z])/g, " $1").trim()}</Label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleInputChange(e, parent, child, index)}
                className={errorClass}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleArrayRemove(parent, child, index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleArrayAdd(parent, child, "")}
          >
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
          {isRejected && (
            <p className="text-red-500 text-sm mt-1">
              {getRejectionReason(field)}
            </p>
          )}
          {formErrors[field] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
          )}
        </div>
      );
    }

    // Payment terms customTerms
    if (field === "paymentTerms.customTerms") {
      return (
        <div key={field} className="space-y-2">
          <Label>Custom Payment Terms</Label>
          {formData.paymentTerms.customTerms.map((term, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Days"
                value={term.days}
                onChange={(e) => {
                  const newTerms = [...formData.paymentTerms.customTerms];
                  newTerms[index] = {
                    ...newTerms[index],
                    days: e.target.value,
                  };
                  setFormData((prev) => ({
                    ...prev,
                    paymentTerms: {
                      ...prev.paymentTerms,
                      customTerms: newTerms,
                    },
                  }));
                }}
                className={errorClass}
              />
              <Input
                placeholder="Percentage"
                type="number"
                value={term.percentage}
                onChange={(e) => {
                  const newTerms = [...formData.paymentTerms.customTerms];
                  newTerms[index] = {
                    ...newTerms[index],
                    percentage: e.target.value,
                  };
                  setFormData((prev) => ({
                    ...prev,
                    paymentTerms: {
                      ...prev.paymentTerms,
                      customTerms: newTerms,
                    },
                  }));
                }}
                className={errorClass}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleArrayRemove("paymentTerms", "customTerms", index)
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleArrayAdd("paymentTerms", "customTerms", {
                days: "",
                percentage: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Add Term
          </Button>
          {isRejected && (
            <p className="text-red-500 text-sm mt-1">
              {getRejectionReason(field)}
            </p>
          )}
          {formErrors[field] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
          )}
        </div>
      );
    }

    // Boolean fields (policies)
    if (
      [
        "policies.terms",
        "policies.privacy",
        "policies.conditions",
        "policies.authentic",
      ].includes(field)
    ) {
      return (
        <div key={field} className="flex items-center space-x-2">
          <Checkbox
            id={field}
            checked={formData[parent][child]}
            onCheckedChange={(checked) =>
              handleInputChange(
                { target: { type: "checkbox", checked } },
                parent,
                child
              )
            }
          />
          <Label htmlFor={field}>
            {child.replace(/([A-Z])/g, " $1").trim()}
          </Label>
          {isRejected && (
            <p className="text-red-500 text-sm mt-1">
              {getRejectionReason(field)}
            </p>
          )}
          {formErrors[field] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
          )}
        </div>
      );
    }

    // Textarea for storeDescription
    if (field === "storeDescription") {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field}>Store Description</Label>
          <Textarea
            id={field}
            name={field}
            value={formData[field]}
            onChange={(e) => handleInputChange(e, field)}
            className={errorClass}
          />
          {isRejected && (
            <p className="text-red-500 text-sm mt-1">
              {getRejectionReason(field)}
            </p>
          )}
          {formErrors[field] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
          )}
        </div>
      );
    }

    // Number inputs for paymentTerms.upfront and onDelivery
    if (["paymentTerms.upfront", "paymentTerms.onDelivery"].includes(field)) {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={child}>
            {child.replace(/([A-Z])/g, " $1").trim()} (%)
          </Label>
          <Input
            id={child}
            type="number"
            name={child}
            value={formData[parent][child]}
            onChange={(e) => handleInputChange(e, parent, child)}
            className={errorClass}
            min="0"
            max="100"
          />
          {isRejected && (
            <p className="text-red-500 text-sm mt-1">
              {getRejectionReason(field)}
            </p>
          )}
          {formErrors[field] ||
            (formErrors["paymentTerms"] && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors[field] || formErrors["paymentTerms"]}
              </p>
            ))}
        </div>
      );
    }

    // Default input for other fields
    return (
      <div key={field} className="space-y-2">
        <Label htmlFor={child || field}>
          {(child || field).replace(/([A-Z])/g, " $1").trim()}
        </Label>
        <Input
          id={child || field}
          name={child || field}
          value={child ? formData[parent][child] : formData[field]}
          onChange={(e) => handleInputChange(e, parent || field, child)}
          className={errorClass}
        />
        {isRejected && (
          <p className="text-red-500 text-sm mt-1">
            {getRejectionReason(field)}
          </p>
        )}
        {formErrors[field] && (
          <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
        )}
      </div>
    );
  };

  if (loading && !store) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-[16px] w-64"></div>
          <div className="h-4 bg-gray-200 rounded-[16px] w-48"></div>
        </div>
      </div>
    );
  }

  if (error && !store) {
    return (
      <div className="text-center space-y-4 min-h-[100vh] flex flex-col items-center justify-center">
        <p className="text-[18px]">
          To upload products and catalogs, please verify your store/business
          first. <br /> Click the button below to start the verification
          process.
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
  }

  if (!status || status === "pending") {
    return (
      <div className="min-h-[100vh] flex flex-col items-center justify-center space-y-6 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>
              {!status ? "Store Not Setup" : "Pending Approval"}
            </CardTitle>
            <CardDescription>
              {!status
                ? "Your store has not been set up yet."
                : "Your store setup is currently under review."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleVerifyNow}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {!status ? "Setup Store" : "View Status"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "approved" || status === "rejected") {
    return (
      <div className="min-h-[85vh] py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3 relative py-0">
              {filePreviews.coverImage && (
                <div className="h-52 w-full bg-gray-100 overflow-hidden">
                  <Image
                    width={500}
                    height={500}
                    src={filePreviews.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover rounded-t-[16px]"
                  />
                </div>
              )}
              <CardContent className="p-6 flex flex-col items-center relative">
                <div
                  className={`relative -mt-24 mb-4 ${
                    !filePreviews.coverImage ? "mt-0" : ""
                  }`}
                >
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800">
                    <Image
                      width={128}
                      height={128}
                      src={filePreviews.storeLogo || "/placeholder.png"}
                      alt="Logo"
                      className="w-auto h-auto"
                    />
                    <AvatarFallback className="text-4xl">
                      {formData.storeName?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {isEditing ? (
                  <div className="w-full space-y-4">
                    {editableFields.map((field) => renderField(field))}
                    {formErrors.general && (
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {formErrors.general}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="cursor-pointer"
                      >
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-[#001C44] hover:bg-[#001C44]/90 cursor-pointer"
                        disabled={loading}
                      >
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">
                        {store?.storeName || "Store Name"}
                      </h2>
                      <Badge
                        variant={
                          status === "approved" ? "success" : "destructive"
                        }
                        className="text-sm"
                      >
                        {status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                      <p className="text-muted-foreground">
                        {store?.storeDescription || "No description"}
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <a
                          href={store?.companyWebsite}
                          target="_blank"
                          rel="noopener"
                          className="hover:underline text-blue-800"
                        >
                          {store?.companyWebsite || "No website"}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span>{store?.businessEmail || "No email"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{store?.phoneNumber || "No phone"}</span>
                      </div>
                    </div>
                    <Button
                      onClick={
                        status === "approved"
                          ? handleEditProfile
                          : handleUpdateInfo
                      }
                      className="mt-6 w-auto bg-[#001C44] hover:bg-[#001C44]/90 cursor-pointer"
                    >
                      <Edit />{" "}
                      {status === "approved" ? "Edit Profile" : "Update Info"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            <div className="w-full md:w-2/3 space-y-6">
              <Alert
                variant={status === "approved" ? "success" : "destructive"}
                className="flex items-start gap-4"
              >
                <div className="flex-1">
                  <AlertTitle className="text-lg font-semibold">
                    {status === "approved"
                      ? "Your store has been approved!"
                      : "Your store setup was rejected"}
                  </AlertTitle>
                  <AlertDescription className="mt-1 text-sm">
                    {status === "approved"
                      ? "You can now start adding products and managing your store."
                      : "Please review your information and resubmit your application."}
                    {status === "rejected" && rejectionReasons.length > 0 && (
                      <ul className="mt-2 list-disc pl-5">
                        {rejectionReasons.map((reason, index) => (
                          <li key={index}>
                            {reason.field}: {reason.reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </div>
                <Button
                  size="sm"
                  variant={status === "approved" ? "default" : "destructive"}
                  className={`mt-1 shrink-0 cursor-pointer ${
                    status === "approved"
                      ? "bg-[#001C44] hover:bg-[#001C44]/90"
                      : "bg-red-500 hover:bg-red-500/90"
                  }`}
                  onClick={
                    status === "approved"
                      ? handleCreateCatalog
                      : handleUpdateInfo
                  }
                >
                  {status === "approved" ? "Create Catalog" : "Update Info"}
                </Button>
              </Alert>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Preferred Language
                          </h4>
                          <p className="capitalize">
                            {store?.preferredLanguage || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            ABBF Membership
                          </h4>
                          <p className="capitalize">
                            {store?.abbfMembership || "No"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Description
                        </h4>
                        <p className="whitespace-pre-line">
                          {store?.storeDescription || "No description provided"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Address Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="space-y-1">
                          <p className="font-medium">
                            {store?.addressLine1 || "Address not provided"}
                          </p>
                          {store?.addressLine2 && (
                            <p className="text-muted-foreground">
                              {store.addressLine2}
                            </p>
                          )}
                          <div className="text-muted-foreground">
                            <p>
                              {store?.city && `${store.city}, `}
                              {store?.postalCode && `${store.postalCode}, `}
                              {store?.country || ""}
                            </p>
                          </div>
                          {store?.landmark && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Landmark:</span>{" "}
                              {store.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Person for B2B Meeting</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {store?.contactPerson && (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm text-muted-foreground">
                                Name
                              </h5>
                              <p>{store.contactPerson.name}</p>
                            </div>
                            <div>
                              <h5 className="text-sm text-muted-foreground">
                                Designation
                              </h5>
                              <p>{store.contactPerson.designation}</p>
                            </div>
                            <div>
                              <h5 className="text-sm text-muted-foreground">
                                Mobile
                              </h5>
                              <p>{store.contactPerson.mobile}</p>
                            </div>
                            <div>
                              <h5 className="text-sm text-muted-foreground">
                                Email
                              </h5>
                              <p>{store.contactPerson.email}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="business" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Legal Status
                          </h4>
                          <p className="capitalize">
                            {store?.legalStatus || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Nature of Business
                          </h4>
                          <p className="capitalize">
                            {store?.natureOfBusiness || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Business Sector
                          </h4>
                          <p className="capitalize">
                            {store?.businessSector || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Certifications
                          </h4>
                          <p className="capitalize">
                            {store?.certifications || "None"}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <h4 className="font-medium">Business Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {store?.businessDetails?.businessRegistration && (
                          <a
                            href={`${BASE_URL}${store.businessDetails.businessRegistration}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-800 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            Business Registration
                          </a>
                        )}
                        {store?.businessDetails?.taxId && (
                          <a
                            href={`${BASE_URL}${store.businessDetails.taxId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-800 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            Tax ID
                          </a>
                        )}
                        {store?.businessDetails?.proofOfAddress && (
                          <a
                            href={`${BASE_URL}${store.businessDetails.proofOfAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-800 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            Proof of Address
                          </a>
                        )}
                        {store?.businessDetails?.ownerIdentification && (
                          <a
                            href={`${BASE_URL}${store.businessDetails.ownerIdentification}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-800 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            Owner Identification
                          </a>
                        )}
                      </div>

                      {store?.businessDetails?.additionalDocuments?.length >
                        0 && (
                        <>
                          <Separator className="my-4" />
                          <h4 className="font-medium">Additional Documents</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {store.businessDetails.additionalDocuments.map(
                              (doc, index) => (
                                <a
                                  key={index}
                                  href={`${BASE_URL}${doc.file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-800 hover:underline"
                                >
                                  <FileText className="h-4 w-4" />
                                  {doc.name || `Document ${index + 1}`}
                                </a>
                              )
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bank Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Bank Name
                          </h4>
                          <p>
                            {store?.bankDetails?.bankName || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Account Number
                          </h4>
                          <p>
                            {store?.bankDetails?.accountNumber ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Swift Code
                          </h4>
                          <p>
                            {store?.bankDetails?.swiftCode || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Currency
                          </h4>
                          <p>
                            {store?.bankDetails?.currency || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Primary Account
                          </h4>
                          <p>
                            {store?.bankDetails?.isPrimary === "yes"
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Upfront Payment
                          </h4>
                          <p>{store?.paymentTerms?.upfront || "0"}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            On Delivery
                          </h4>
                          <p>{store?.paymentTerms?.onDelivery || "0"}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Accepted Currencies
                          </h4>
                          <p>
                            {store?.paymentTerms?.acceptedCurrencies?.join(
                              ", "
                            ) || "None"}
                          </p>
                        </div>
                      </div>

                      {store?.paymentTerms?.customTerms?.length > 0 && (
                        <>
                          <Separator className="my-4" />
                          <h4 className="font-medium mb-2">
                            Custom Payment Terms
                          </h4>
                          <div className="space-y-2">
                            {store.paymentTerms.customTerms.map(
                              (term, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-muted/50 rounded-[16px]"
                                >
                                  <span>{term.days} days</span>
                                  <span>{term.percentage}%</span>
                                </div>
                              )
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Regions
                          </h4>
                          <p className="capitalize">
                            {store?.shipping?.regions?.join(", ") ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Carriers
                          </h4>
                          <p className="capitalize">
                            {store?.shipping?.carriers?.join(", ") ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Policies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span>Terms & Conditions</span>
                          </div>
                          <Badge
                            variant={
                              store?.policies?.terms ? "success" : "destructive"
                            }
                          >
                            {store?.policies?.terms ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span>Privacy Policy</span>
                          </div>
                          <Badge
                            variant={
                              store?.policies?.privacy
                                ? "success"
                                : "destructive"
                            }
                          >
                            {store?.policies?.privacy ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span>Return Conditions</span>
                          </div>
                          <Badge
                            variant={
                              store?.policies?.conditions
                                ? "success"
                                : "destructive"
                            }
                          >
                            {store?.policies?.conditions
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span>Authenticity Guarantee</span>
                          </div>
                          <Badge
                            variant={
                              store?.policies?.authentic
                                ? "success"
                                : "destructive"
                            }
                          >
                            {store?.policies?.authentic
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CompanyAndSite;
