import React from "react";
import { BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const ViewDetails = ({ store }) => {
  if (!store)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No store data available</p>
      </div>
    );

  // Status badge mapping
  const statusVariant =
    {
      approved: "success",
      rejected: "destructive",
      pending: "warning",
    }[store.status] || "default";

  // Helper function to render file preview
  const renderFilePreview = (
    filePath,
    altText,
    className = "w-32 h-32 object-cover rounded-md"
  ) => {
    if (!filePath) return null;

    const fullPath = filePath.startsWith("http")
      ? filePath
      : `${BASE_URL}${filePath}`;

    return (
      <div className="flex flex-col gap-2 mt-2">
        <div className=" group">
          <Image
            src={fullPath}
            alt={altText}
            className={className}
            width={128}
            height={128}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
         
        </div>
        <Button variant="outline" size="sm" className="w-fit gap-2" asChild>
          <a href={fullPath} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View Full Size
          </a>
        </Button>
      </div>
    );
  };

  // Helper function to render document links
  const renderDocumentLink = (filePath, label) => {
    if (!filePath) return null;

    const fullPath = filePath.startsWith("http")
      ? filePath
      : `${BASE_URL}${filePath}`;

    return (
      <Button variant="link" size="sm" className="pl-0 gap-2" asChild>
        <a href={fullPath} target="_blank" rel="noopener noreferrer">
          <FileText className="h-4 w-4" />
          {label}
        </a>
      </Button>
    );
  };

  // Section component for better organization
  const Section = ({ title, children }) => (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  );

  // Field component for consistent styling
  const Field = ({ label, value, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <div className="md:col-span-2">
        {children || (
          <p className="text-sm">
            {value || (
              <span className="text-muted-foreground">Not provided</span>
            )}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with status */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Badge variant={statusVariant} className="text-sm">
            {store.status.toUpperCase()}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(store.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Basic Information Section */}
      <Section title="Basic Information">
        <Field label="Store Name" value={store.storeName} />
        <Field label="Store Logo">
          {renderFilePreview(store.storeLogo, "Store Logo")}
        </Field>
        <Field label="Cover Image">
          {renderFilePreview(
            store.coverImage,
            "Cover Image",
            "w-full h-48 object-cover rounded-md"
          )}
        </Field>
        <Field label="Company Website">
          {store.companyWebsite ? (
            <Button variant="link" size="sm" className="pl-0 gap-2" asChild>
              <a
                href={store.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {store.companyWebsite}
              </a>
            </Button>
          ) : (
            <span className="text-muted-foreground text-sm">Not provided</span>
          )}
        </Field>
        <Field label="Preferred Language" value={store.preferredLanguage} />
        <Field label="Store Description" value={store.storeDescription} />
        <Field label="ABBF Membership" value={store.abbfMembership} />
      </Section>

      {/* Contact Information Section */}
      <Section title="Contact Information">
        <Field label="Business Email" value={store.businessEmail} />
        <Field label="Phone Number" value={store.phoneNumber} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <p className="text-sm font-medium text-muted-foreground">Address</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-sm">{store.addressLine1}</p>
            {store.addressLine2 && (
              <p className="text-sm">{store.addressLine2}</p>
            )}
            <p className="text-sm">
              {store.city}, {store.postalCode}
            </p>
            <p className="text-sm">{store.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <p className="text-sm font-medium text-muted-foreground">
              Contact Person
            </p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-sm">
              {store.contactPerson?.name || "Not provided"}
            </p>
            <p className="text-sm text-muted-foreground">
              {store.contactPerson?.designation}
            </p>
            <p className="text-sm">{store.contactPerson?.mobile}</p>
            <p className="text-sm">{store.contactPerson?.email}</p>
          </div>
        </div>
      </Section>

      {/* Business Details Section */}
      <Section title="Business Details">
        <Field label="Legal Status" value={store.legalStatus} />
        <Field label="Nature of Business" value={store.natureOfBusiness} />
        <Field label="Business Sector" value={store.businessSector} />
        <Field label="Certifications" value={store.certifications} />

        <Field label="Documents">
          <div className="flex flex-col gap-2">
            {renderDocumentLink(
              store.businessDetails?.businessRegistration,
              "Business Registration"
            )}
            {renderDocumentLink(store.businessDetails?.taxId, "Tax ID")}
            {renderDocumentLink(
              store.businessDetails?.proofOfAddress,
              "Proof of Address"
            )}
            {renderDocumentLink(
              store.businessDetails?.ownerIdentification,
              "Owner Identification"
            )}
          </div>
        </Field>

        {store.businessDetails?.additionalDocuments?.length > 0 && (
          <Field label="Additional Documents">
            <div className="space-y-2">
              {store.businessDetails.additionalDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 gap-2"
                    asChild
                  >
                    <a
                      href={`${BASE_URL}${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.name || `Document ${index + 1}`}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </Field>
        )}
      </Section>

      {/* Bank Details Section */}
      <Section title="Bank Details">
        <Field label="Bank Name" value={store.bankDetails?.bankName} />
        <Field
          label="Account Number"
          value={store.bankDetails?.accountNumber}
        />
        <Field label="Swift Code" value={store.bankDetails?.swiftCode} />
        <Field label="Currency" value={store.bankDetails?.currency} />
        <Field
          label="Primary Account"
          value={store.bankDetails?.isPrimary === "true" ? "Yes" : "No"}
        />
      </Section>

      {/* Payment Terms Section */}
      <Section title="Payment Terms">
        <Field
          label="Upfront Payment"
          value={
            store.paymentTerms?.upfront
              ? `${store.paymentTerms.upfront}%`
              : null
          }
        />
        <Field
          label="On Delivery Payment"
          value={
            store.paymentTerms?.onDelivery
              ? `${store.paymentTerms.onDelivery}%`
              : null
          }
        />

        <Field label="Accepted Currencies">
          {store.paymentTerms?.acceptedCurrencies?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {store.paymentTerms.acceptedCurrencies.map((currency, index) => (
                <Badge key={index} variant="outline">
                  {currency}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Not specified</span>
          )}
        </Field>

        <Field label="Custom Payment Terms">
          {store.paymentTerms?.customTerms?.length > 0 ? (
            <ul className="space-y-2">
              {store.paymentTerms.customTerms.map((term, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{term.days} days</span>
                  <span className="text-muted-foreground text-sm">-</span>
                  <span className="text-sm">{term.percentage}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground text-sm">
              No custom terms
            </span>
          )}
        </Field>

        <Field
          label="Formatted Terms"
          value={store.paymentTerms?.formattedTerms}
        />
      </Section>

      {/* Shipping Information Section */}
      <Section title="Shipping Information">
        <Field label="Shipping Regions">
          {store.shipping?.regions?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {store.shipping.regions.map((region, index) => (
                <Badge key={index} variant="outline">
                  {region}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Not specified</span>
          )}
        </Field>

        <Field label="Shipping Carriers">
          {store.shipping?.carriers?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {store.shipping.carriers.map((carrier, index) => (
                <Badge key={index} variant="outline">
                  {carrier}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Not specified</span>
          )}
        </Field>
      </Section>

      {/* Policies Section */}
      <Section title="Policies">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Terms</p>
            <Badge variant={store.policies?.terms ? "success" : "destructive"}>
              {store.policies?.terms ? "Accepted" : "Not Accepted"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Privacy</p>
            <Badge
              variant={store.policies?.privacy ? "success" : "destructive"}
            >
              {store.policies?.privacy ? "Accepted" : "Not Accepted"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Conditions
            </p>
            <Badge
              variant={store.policies?.conditions ? "success" : "destructive"}
            >
              {store.policies?.conditions ? "Accepted" : "Not Accepted"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Authenticity
            </p>
            <Badge
              variant={store.policies?.authentic ? "success" : "destructive"}
            >
              {store.policies?.authentic ? "Guaranteed" : "Not Guaranteed"}
            </Badge>
          </div>
        </div>
      </Section>

      {/* Rejection Reasons (if applicable) */}
      {store.status === "rejected" && store.rejectionReasons?.length > 0 && (
        <Section title="Rejection Reasons">
          <div className="space-y-3">
            {store.rejectionReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-destructive/10 p-4 rounded-md border border-destructive/20"
              >
                <p className="font-medium text-destructive">{reason.field}</p>
                <p className="text-sm">{reason.reason}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default ViewDetails;
