import * as z from "zod";

export const storeSchema = z.object({
  // Step 1: Basic Information
  storeName: z
    .string()
    .min(1, "Store name is required")
    .max(100, "Store name must be 100 characters or less"),
  storeLogo: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined,
      "Store logo is required"
    ),
  coverImage: z.any().optional(),
  companyWebsite: z
    .string()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .optional()
    .or(z.literal("")),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  storeDescription: z
    .string()
    .max(1000, "Store description must be 1000 characters or less")
    .optional(),
  abbfMembership: z.string().min(1, "ABBF membership status is required"),

  // Step 2: Contact Details
  businessEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Business email is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[1-9]\d{0,14}$/,
      "Please enter a valid phone number (e.g., +1234567890)"
    ),
  addressLine1: z
    .string()
    .min(1, "Address Line 1 is required")
    .max(100, "Address Line 1 must be 100 characters or less"),
  addressLine2: z
    .string()
    .max(100, "Address Line 2 must be 100 characters or less")
    .optional(),
  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City must be 50 characters or less"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[A-Za-z0-9\s-]{3,10}$/, "Please enter a valid postal code"),
  country: z.string().min(1, "Country is required"),
  contactPerson: z.object({
    name: z
      .string()
      .min(1, "Contact person name is required")
      .max(100, "Contact person name must be 100 characters or less"),
    designation: z
      .string()
      .min(1, "Designation is required")
      .max(50, "Designation must be 50 characters or less"),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid mobile number (e.g., +1234567890)"
      ),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Contact person email is required"),
  }),

  // Step 3: Business Type
  legalStatus: z.string().min(1, "Legal status is required"),
  natureOfBusiness: z
    .string()
    .min(1, "Nature of business is required")
    .max(100, "Nature of business must be 100 characters or less"),
  businessSector: z
    .string()
    .min(1, "Business sector is required")
    .max(100, "Business sector must be 100 characters or less"),
  certifications: z.string().min(1, "Certification status is required"),
  businessRegistration: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined,
      "Business registration document is required"
    ),
  taxId: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined,
      "Tax ID document is required"
    ),
  proofOfAddress: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined,
      "Proof of address document is required"
    ),
  ownerIdentification: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined,
      "Owner identification document is required"
    ),
  additionalDocuments: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Document name is required")
          .max(100, "Document name must be 100 characters or less"),
        file: z.any().optional(),
        fileDataURL: z.string().optional(),
        fileName: z.string().optional(),
      })
    )
    .optional(),

  // Step 4: Bank Details
  bankDetails: z.object({
    bankName: z
      .string()
      .min(1, "Bank name is required")
      .max(100, "Bank name must be 100 characters or less"),
    accountNumber: z
      .string()
      .min(1, "Account number is required")
      .regex(/^[A-Za-z0-9\s-]{8,34}$/, "Please enter a valid account number"),
    swiftCode: z.string().min(1, "SWIFT code is required"),
    currency: z.string().min(1, "Currency is required"),
    isPrimary: z
      .string()
      .min(1, "Please select if this is the primary account"),
  }),
  paymentTerms: z.object({
    upfront: z
      .string()
      .min(1, "Upfront payment term is required")
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Please enter a valid percentage (e.g., 30 or 30.00)"
      ),
    onDelivery: z
      .string()
      .min(1, "On delivery term is required")
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Please enter a valid percentage (e.g., 70 or 70.00)"
      ),
    acceptedCurrencies: z
      .array(z.string())
      .min(1, "Select at least one accepted currency"),
    customTerms: z
      .array(
        z.object({
          days: z
            .string()
            .regex(/^\d+$/, "Please enter a valid number of days")
            .optional(),
          percentage: z
            .string()
            .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid percentage")
            .optional(),
        })
      )
      .optional(),
    formattedTerms: z.string().optional(),
  }),
  shipping: z.object({
    regions: z.array(z.string()).optional(),
    carriers: z.array(z.string()).optional(),
  }),

  // Step 5: Policies
  policies: z.object({
    terms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms of Service"),
    privacy: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Privacy Policy"),
    conditions: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
    authentic: z
      .boolean()
      .refine((val) => val === true, "You must confirm document authenticity"),
  }),
});

export const defaultFormValues = {
  storeName: "",
  storeLogo: null,
  coverImage: null,
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
  businessRegistration: null,
  taxId: null,
  proofOfAddress: null,
  ownerIdentification: null,
  additionalDocuments: [],
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
    formattedTerms: "",
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
};