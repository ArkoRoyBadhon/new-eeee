"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Step1BasicInfo from "@/app/(all-deshboard)/(seller-dashboard)/seller/_components/store-setup/Step1BasicInfo";
import Step2ContactDetails from "@/app/(all-deshboard)/(seller-dashboard)/seller/_components/store-setup/Step2ContactDetails";
import Step3BusinessType from "@/app/(all-deshboard)/(seller-dashboard)/seller/_components/store-setup/Step3BusinessType";
import Step4BankDetails from "@/app/(all-deshboard)/(seller-dashboard)/seller/_components/store-setup/Step4BankDetails";
import Step5Policies from "@/app/(all-deshboard)/(seller-dashboard)/seller/_components/store-setup/Step5Policies";
import Step6Review from "@/app/(all-deshboard)/(seller-dashboard)/seller/_components/store-setup/Step6Review";
import { storeSchema, defaultFormValues } from "@/lib/schemas/storeSetupSchema";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { fetchStoreStatus } from "@/lib/store/slices/storeSetupSlice";

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const FormPage = ({ params }) => {
  const { form: formType } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { status, loading, error } = useSelector((state) => state.storeSetup);

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  // Initialize step from localStorage or default to 1
  const [step, setStep] = useState(() => {
    const savedData = localStorage.getItem("storeSetupForm");
    return savedData ? JSON.parse(savedData).step || 1 : 1;
  });

  // Fetch store status on mount
  useEffect(() => {
    if (user && token) {
      dispatch(fetchStoreStatus());
    }
  }, [user, token, dispatch]);

  // Restrict access if store setup has been submitted
  useEffect(() => {
    if (formType === "register-store" && status && ["pending", "approved", "rejected"].includes(status)) {
      router.replace("/seller/store");
    }
  }, [formType, status, router]);

  // Restore and sync saved data from localStorage on every render
  useEffect(() => {
    const savedData = localStorage.getItem("storeSetupForm");
    if (savedData && formType === "register-store") {
      const { data, timestamp, step: savedStep } = JSON.parse(savedData);
      const now = new Date().getTime();
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        console.log("Restoring saved form data:", data);
        const restoredData = { ...data };
        const fileFields = [
          { key: "storeLogo", name: "storeLogoName", url: "storeLogoDataURL" },
          { key: "coverImage", name: "coverImageName", url: "coverImageDataURL" },
          { key: "businessRegistration", name: "businessRegistrationName", url: "businessRegistrationDataURL" },
          { key: "taxId", name: "taxIdName", url: "taxIdDataURL" },
          { key: "proofOfAddress", name: "proofOfAddressName", url: "proofOfAddressDataURL" },
          { key: "ownerIdentification", name: "ownerIdentificationName", url: "ownerIdentificationDataURL" },
        ];

        fileFields.forEach((field) => {
          if (restoredData[field.url]) {
            restoredData[field.key] = dataURLtoFile(restoredData[field.url], restoredData[field.name] || `${field.key}_${Date.now()}`);
          } else {
            restoredData[field.key] = null;
          }
        });

        if (restoredData.additionalDocuments) {
          restoredData.additionalDocuments = restoredData.additionalDocuments.map((doc) => ({
            ...doc,
            file: doc.fileDataURL ? dataURLtoFile(doc.fileDataURL, doc.fileName || `additionalDoc_${Date.now()}`) : null,
          }));
        }
        form.reset(restoredData, { keepDirty: true });
        setStep(savedStep || 1); // Restore step if available
      } else {
        console.log("Clearing expired form data");
        localStorage.removeItem("storeSetupForm");
        form.reset(defaultFormValues);
        setStep(1);
      }
    }
  }, [form, formType]);

  const saveFormData = async (data) => {
    const formDataToSave = { ...data };
    const fileFields = [
      { key: "storeLogo", name: "storeLogoName", url: "storeLogoDataURL" },
      { key: "coverImage", name: "coverImageName", url: "coverImageDataURL" },
      { key: "businessRegistration", name: "businessRegistrationName", url: "businessRegistrationDataURL" },
      { key: "taxId", name: "taxIdName", url: "taxIdDataURL" },
      { key: "proofOfAddress", name: "proofOfAddressName", url: "proofOfAddressDataURL" },
      { key: "ownerIdentification", name: "ownerIdentificationName", url: "ownerIdentificationDataURL" },
    ];

    for (const field of fileFields) {
      if (formDataToSave[field.key] instanceof File) {
        try {
          const dataURL = await readFileAsDataURL(formDataToSave[field.key]);
          formDataToSave[field.url] = dataURL;
          formDataToSave[field.name] = formDataToSave[field.key].name;
        } catch (error) {
          console.error(`Error reading ${field.key}:`, error);
          formDataToSave[field.url] = null;
          formDataToSave[field.name] = null;
        }
        delete formDataToSave[field.key];
      } else {
        formDataToSave[field.url] = formDataToSave[field.url] || null;
        formDataToSave[field.name] = formDataToSave[field.name] || null;
      }
    }

    if (formDataToSave.additionalDocuments) {
      formDataToSave.additionalDocuments = await Promise.all(
        formDataToSave.additionalDocuments.map(async (doc) => {
          if (doc.file instanceof File) {
            try {
              const dataURL = await readFileAsDataURL(doc.file);
              return { ...doc, fileDataURL: dataURL, fileName: doc.file.name, file: null };
            } catch (error) {
              console.error("Error reading additional document:", error);
              return { ...doc, fileDataURL: null, fileName: null, file: null };
            }
          }
          return { ...doc, fileDataURL: doc.fileDataURL || null, fileName: doc.fileName || null, file: null };
        })
      );
    }

    saveToLocalStorage(formDataToSave, step);
  };

  const saveToLocalStorage = (data, currentStep) => {
    console.log("Saving form data to localStorage:", data, "Step:", currentStep);
    localStorage.setItem(
      "storeSetupForm",
      JSON.stringify({
        data,
        step: currentStep,
        timestamp: new Date().getTime(),
      })
    );
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["storeName", "storeLogo", "coverImage", "companyWebsite", "preferredLanguage", "storeDescription", "abbfMembership"];
      case 2:
        return ["businessEmail", "phoneNumber", "addressLine1", "addressLine2", "city", "postalCode", "country", "contactPerson.name", "contactPerson.designation", "contactPerson.mobile", "contactPerson.email"];
      case 3:
        return ["legalStatus", "natureOfBusiness", "businessSector", "certifications", "businessRegistration", "taxId", "proofOfAddress", "ownerIdentification", "additionalDocuments"];
      case 4:
        return [
          "bankDetails.bankName",
          "bankDetails.accountNumber",
          "bankDetails.swiftCode",
          "bankDetails.currency",
          "bankDetails.isPrimary",
          "paymentTerms.upfront",
          "paymentTerms.onDelivery",
          "paymentTerms.acceptedCurrencies",
          "paymentTerms.customTerms",
          "shipping.regions",
          "shipping.carriers",
        ];
      case 5:
        return ["policies.terms", "policies.privacy", "policies.conditions", "policies.authentic"];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    console.log("Raw Form Data:", data);
    if (!data || Object.keys(data).length === 0) {
      console.error("Form data is empty");
      toast.error("Form data is empty. Please fill out the form.");
      return;
    }

    const submissionData = new FormData();
    const { storeLogo, coverImage, businessRegistration, taxId, proofOfAddress, ownerIdentification, additionalDocuments, ...storeData } = data;

    if (!storeData || Object.keys(storeData).length === 0) {
      console.error("storeData is empty after destructuring");
      toast.error("Store data is missing. Please ensure all required fields are filled.");
      return;
    }

    submissionData.append(
      "storeData",
      JSON.stringify({
        ...storeData,
        businessDetails: {
          ...storeData.businessDetails,
          additionalDocuments: additionalDocuments.map((doc) => ({ name: doc.name })),
        },
      })
    );

    const appendFile = (key, file) => {
      if (file instanceof File) {
        console.log(`Appending file for ${key}:`, file.name);
        submissionData.append(key, file);
      } else {
        console.warn(`No valid file for ${key}:`, file);
        toast.error(`Please upload a valid file for ${key}`);
      }
    };

    appendFile("storeLogo", storeLogo);
    appendFile("coverImage", coverImage);
    appendFile("businessRegistration", businessRegistration);
    appendFile("taxId", taxId);
    appendFile("proofOfAddress", proofOfAddress);
    appendFile("ownerIdentification", ownerIdentification);

    if (additionalDocuments && Array.isArray(additionalDocuments)) {
      additionalDocuments.forEach((doc, index) => {
        if (doc.file instanceof File) {
          console.log(`Appending additionalDocuments file:`, doc.file.name);
          submissionData.append(`additionalDocuments`, doc.file);
        }
      });
    }

    const formDataEntries = {};
    for (const [key, value] of submissionData.entries()) {
      formDataEntries[key] = value instanceof File ? value.name : value;
    }
    console.log("FormData Contents:", formDataEntries);

    if (!formDataEntries.storeData) {
      console.error("storeData not appended to FormData");
      toast.error("Failed to prepare store data for submission.");
      return;
    }

    if (
      !formDataEntries.storeLogo ||
      !formDataEntries.businessRegistration ||
      !formDataEntries.taxId ||
      !formDataEntries.proofOfAddress ||
      !formDataEntries.ownerIdentification
    ) {
      toast.error("Please upload all required files (Store Logo, Business Registration, Tax ID, Proof of Address, Owner Identification).");
      return;
    }

    try {
      console.log("Sending API request with token:", token);
      const response = await axios({
        method: "post",
        url: `${BASE_URL}/store/setup`,
        data: submissionData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Store setup submitted successfully!");
      localStorage.removeItem("storeSetupForm");
      form.reset(defaultFormValues);
      setStep(1);
      dispatch(fetchStoreStatus());
      router.push("/seller/store");
    } catch (error) {
      console.error("Submission error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to submit store setup. Please try again.");
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await form.trigger(fieldsToValidate);

    const formData = form.getValues();
    console.log(`Form values on Step ${step} (Next):`, formData);
    await saveFormData(formData);

    if (!isValid) {
      console.log("Validation errors:", form.formState.errors);
      toast.error("Please fill all required fields correctly");
    } else {
      if (step === 4) {
        const { upfront, onDelivery, customTerms } = form.getValues("paymentTerms");
        const calculateTotalPercentage = () => {
          const upfrontValue = parseFloat(upfront) || 0;
          const onDeliveryValue = parseFloat(onDelivery) || 0;
          const customTermsTotal = (customTerms || []).reduce((sum, term) => {
            return sum + (parseFloat(term.percentage) || 0);
          }, 0);
          return upfrontValue + onDeliveryValue + customTermsTotal;
        };

        const total = calculateTotalPercentage();
        if (total !== 100) {
          toast.error("Total payment percentage must be exactly 100%. Please adjust the values.");
          return;
        }
        const formatPaymentTerms = () => {
          const terms = [];
          if (parseFloat(upfront) > 0) terms.push(`${upfront}% Upfront`);
          (customTerms || []).forEach((term) => {
            if (term.days && term.percentage) {
              terms.push(`${term.days} days ${term.percentage}%`);
            }
          });
          if (parseFloat(onDelivery) > 0) terms.push(`On Delivery ${onDelivery}%`);
          return terms.join(", ");
        };
        form.setValue("formattedTerms", formatPaymentTerms());
      }
      if (step < 6) {
        setStep(step + 1);
      }
    }
  };

  const handlePrevious = () => {
    const formData = form.getValues();
    console.log(`Form values on Step ${step} (Previous):`, formData);
    saveFormData(formData);
    if (step > 1) {
      setStep(step - 1);
    }
  };

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
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 my-[50px] min-h-[100vh]"
      >
        <Card className="w-full max-w-2xl mx-auto py-0">
          <CardContent className="p-6">
            {step === 1 && <Step1BasicInfo />}
            {step === 2 && <Step2ContactDetails />}
            {step === 3 && <Step3BusinessType saveFormData={saveFormData} />}
            {step === 4 && <Step4BankDetails />}
            {step === 5 && <Step5Policies />}
            {step === 6 && <Step6Review />}
            <div className="flex justify-end items-center gap-2 mt-6">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  ← Previous
                </Button>
              )}
              {step < 6 && (
                <Button
                  type="button"
                  className="bg-[#001C44] hover:bg-[#001C44]/90 text-white"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              )}
              {step === 6 && (
                <Button
                  type="submit"
                  className="bg-[#001C44] hover:bg-[#001C44]/90 text-white"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

export default FormPage;