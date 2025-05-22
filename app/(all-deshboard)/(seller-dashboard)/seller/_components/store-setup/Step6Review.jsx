"use client";

import { useFormContext } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  MapPin,
  Building,
  CreditCard,
  FileText,
  PackageCheck,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const Step6Review = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const renderImagePreview = (file, altText, className = "") => {
    if (!file) {
      return (
        <div className="bg-gray-100 rounded-md h-32 w-32 flex items-center justify-center text-sm text-gray-500">
          No image
        </div>
      );
    }

    if (file instanceof File || (typeof file === "object" && file.name)) {
      try {
        const url = file.preview || URL.createObjectURL(file);
        return (
          <div className={`relative ${className}`}>
            <Image
              src={url || "/placeholder.svg"}
              alt={altText}
              width={128}
              height={128}
              className="object-cover rounded-md h-32 w-32"
              onLoad={() => URL.revokeObjectURL(url)}
            />
          </div>
        );
      } catch (e) {
        return (
          <div className="bg-gray-100 rounded-md h-32 w-32 flex items-center justify-center text-sm text-gray-500">
            Preview unavailable
          </div>
        );
      }
    }

    return (
      <div className="bg-gray-100 rounded-md h-32 w-32 flex items-center justify-center text-sm text-gray-500">
        {file.name || "Preview unavailable"}
      </div>
    );
  };

  const renderDocumentPreview = (doc) => {
    if (!doc) return null;

    if (doc instanceof File || (typeof doc === "object" && doc.name)) {
      return (
        <div className="flex items-center gap-2 border rounded-md p-2 bg-white shadow-sm">
          <FileText size={16} className="text-muted-foreground" />
          <span className="text-sm truncate">{doc.name || "Document"}</span>
          <Badge variant="secondary" className="text-xs">
            File
          </Badge>
        </div>
      );
    }

    if (typeof doc === "object" && doc.file) {
      return (
        <div className="flex items-center gap-2 border rounded-md p-2 bg-white shadow-sm">
          <FileText size={16} className="text-muted-foreground" />
          <span className="text-sm truncate">
            {doc.file.name || "Document"}
          </span>
          <Badge variant="secondary" className="text-xs">
            {doc.type || "File"}
          </Badge>
        </div>
      );
    }

    return null;
  };

  return (
    <CardContent className="px-0 pb-0 space-y-6">
      <div className="border-b pb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PackageCheck className="w-6 h-6 text-primary" />
          Review & Submit
        </h2>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[
          "seller-info",
          "basic-info",
          "contact-details",
          "business-type",
          "bank-details",
        ]}
        className="w-full"
      >

        <AccordionItem value="basic-info" className="border-b">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-muted-foreground" />
              Basic Information
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Store Name
                  </h4>
                  <p className="text-base">{formData.storeName || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Company Website
                  </h4>
                  <p className="text-base">
                    {formData.companyWebsite || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Preferred Language
                  </h4>
                  <p className="text-base">
                    {formData.preferredLanguage || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    ABBF Membership
                  </h4>
                  <p className="text-base">
                    {formData.abbfMembership || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Store Description
                  </h4>
                  <p className="text-base">
                    {formData.storeDescription || "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Store Logo
                    </h4>
                    {renderImagePreview(formData.storeLogo, "Store Logo")}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Cover Image
                    </h4>
                    {renderImagePreview(formData.coverImage, "Cover Image")}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact-details" className="border-b">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              Contact Details
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Business Email
                  </h4>
                  <p className="text-base">
                    {formData.businessEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </h4>
                  <p className="text-base">
                    {formData.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h4>
                  <p className="text-base">
                    {formData.addressLine1 || ""}
                    {formData.addressLine2 && (
                      <>
                        <br />
                        {formData.addressLine2}
                      </>
                    )}
                    {formData.city && (
                      <>
                        <br />
                        {formData.city}, {formData.postalCode}
                      </>
                    )}
                    {formData.country && (
                      <>
                        <br />
                        {formData.country}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    Contact Person
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="text-base">
                        {formData.contactPerson?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Designation:
                      </span>
                      <span className="text-end text-base">
                        {formData.contactPerson?.designation || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Mobile:
                      </span>
                      <span className="text-base">
                        {formData.contactPerson?.mobile || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email:
                      </span>
                      <span className="text-base">
                        {formData.contactPerson?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="business-type" className="border-b">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-muted-foreground" />
              Business Type
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Legal Status
                  </h4>
                  <p className="text-base">{formData.legalStatus || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Nature of Business
                  </h4>
                  <p className="text-base">
                    {formData.natureOfBusiness || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Business Sector
                  </h4>
                  <p className="text-base">
                    {formData.businessSector || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Certifications
                  </h4>
                  {formData.certifications ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className="text-sm">
                        {formData.certifications}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-base">None</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Required Documents
                  </h4>
                  <div className="space-y-2">
                    {formData.businessRegistration && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Business Registration:
                        </span>
                        {renderDocumentPreview(formData.businessRegistration)}
                      </div>
                    )}
                    {formData.taxId && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Tax ID:
                        </span>
                        {renderDocumentPreview(formData.taxId)}
                      </div>
                    )}
                    {formData.proofOfAddress && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Proof of Address:
                        </span>
                        {renderDocumentPreview(formData.proofOfAddress)}
                      </div>
                    )}
                    {formData.ownerIdentification && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Owner Identification:
                        </span>
                        {renderDocumentPreview(formData.ownerIdentification)}
                      </div>
                    )}
                    {!formData.businessRegistration &&
                      !formData.taxId &&
                      !formData.proofOfAddress &&
                      !formData.ownerIdentification && (
                        <p className="text-base">
                          No required documents uploaded
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Additional Documents
                  </h4>
                  <div className="space-y-2">
                    {Array.isArray(formData.additionalDocuments) &&
                    formData.additionalDocuments.length > 0 ? (
                      formData.additionalDocuments.map((doc, index) => (
                        <div key={index}>{renderDocumentPreview(doc)}</div>
                      ))
                    ) : (
                      <p className="text-base">
                        No additional documents uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bank-details">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Bank & Payment Details
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    Bank Information
                  </h4>
                  <div className="space-y-2">
                    {formData.bankDetails?.bankName && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Bank Name:
                        </span>
                        <span className="text-base">
                          {formData.bankDetails.bankName}
                        </span>
                      </div>
                    )}
                    {formData.bankDetails?.accountNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Account Number:
                        </span>
                        <span className="text-base">
                          {formData.bankDetails.accountNumber}
                        </span>
                      </div>
                    )}
                    {formData.bankDetails?.swiftCode && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Swift Code:
                        </span>
                        <span className="text-base">
                          {formData.bankDetails.swiftCode}
                        </span>
                      </div>
                    )}
                    {formData.bankDetails?.currency && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Currency:
                        </span>
                        <span className="text-base">
                          {formData.bankDetails.currency}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Primary Account:
                      </span>
                      <span className="text-base">
                        {formData.bankDetails?.isPrimary || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Payment Terms
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-base">
                        Upfront: {formData.paymentTerms?.upfront || "0"}%
                      </span>
                    </div>
                    {Array.isArray(formData.paymentTerms?.customTerms) &&
                      formData.paymentTerms.customTerms.length > 0 &&
                      formData.paymentTerms.customTerms.map(
                        (term, index) =>
                          term.days &&
                          term.percentage && (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-base">
                                {term.days} days: {term.percentage}%
                              </span>
                            </div>
                          )
                      )}
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-base">
                        On Delivery: {formData.paymentTerms?.onDelivery || "0"}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Accepted Currencies
                  </h4>
                  {Array.isArray(formData.paymentTerms?.acceptedCurrencies) &&
                  formData.paymentTerms.acceptedCurrencies.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.paymentTerms.acceptedCurrencies.map(
                        (currency, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm"
                          >
                            {currency}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-base">None specified</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Shipping Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Regions:
                      </span>
                      {Array.isArray(formData.shipping?.regions) &&
                      formData.shipping.regions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.shipping.regions.map((region, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {region}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">None specified</p>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Carriers:
                      </span>
                      {Array.isArray(formData.shipping?.carriers) &&
                      formData.shipping.carriers.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.shipping.carriers.map((carrier, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {carrier}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">None specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  );
};

export default Step6Review;