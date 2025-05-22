"use client";

import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultiSelect from "../multi-select";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Step4BankDetails = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "paymentTerms.customTerms",
    control,
  });

  const acceptedCurrencies = watch("paymentTerms.acceptedCurrencies") ?? [];
  const shippingRegions = watch("shipping.regions") ?? [];
  const shippingCarriers = watch("shipping.carriers") ?? [];
  const upfront = watch("paymentTerms.upfront") || "0";
  const onDelivery = watch("paymentTerms.onDelivery") || "0";
  const customTerms = watch("paymentTerms.customTerms") || [];

  const calculateTotalPercentage = () => {
    const upfrontValue = parseFloat(upfront) || 0;
    const onDeliveryValue = parseFloat(onDelivery) || 0;
    const customTermsTotal = customTerms.reduce((sum, term) => {
      return sum + (parseFloat(term.percentage) || 0);
    }, 0);
    return upfrontValue + onDeliveryValue + customTermsTotal;
  };

  const formatPaymentTerms = () => {
    const terms = [];
    if (parseFloat(upfront) > 0) terms.push(`${upfront}% Upfront`);
    customTerms.forEach((term) => {
      if (term.days && term.percentage) {
        terms.push(`${term.days} days ${term.percentage}%`);
      }
    });
    if (parseFloat(onDelivery) > 0) terms.push(`On Delivery ${onDelivery}%`);
    return terms.join(", ");
  };

  useEffect(() => {
    const total = calculateTotalPercentage();
    if (total > 100) {
      toast.error("Total payment percentage cannot exceed 100%");
    } else if (total < 100 && total > 0) {
      toast.warning("Total payment percentage must be exactly 100% to proceed");
    }
  }, [upfront, onDelivery, customTerms]);

  return (
    <>
      <CardHeader className="px-0 mb-2">
        <CardTitle className="text-2xl font-semibold">Bank Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Bank Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankDetails.bankName">Bank Name *</Label>
            <Input
              id="bankDetails.bankName"
              placeholder="Enter bank name"
              {...register("bankDetails.bankName")}
            />
            {errors.bankDetails?.bankName && (
              <p className="text-red-500 text-[12px]">{errors.bankDetails.bankName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankDetails.accountNumber">Account Number *</Label>
            <Input
              id="bankDetails.accountNumber"
              placeholder="Enter account number"
              {...register("bankDetails.accountNumber")}
            />
            {errors.bankDetails?.accountNumber && (
              <p className="text-red-500 text-[12px]">{errors.bankDetails.accountNumber.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankDetails.swiftCode">SWIFT Code *</Label>
            <Input
              id="bankDetails.swiftCode"
              placeholder="Enter SWIFT code"
              {...register("bankDetails.swiftCode")}
            />
            {errors.bankDetails?.swiftCode && (
              <p className="text-red-500 text-[12px]">{errors.bankDetails.swiftCode.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankDetails.currency">Currency *</Label>
            <Select
              onValueChange={(value) => setValue("bankDetails.currency", value)}
              value={watch("bankDetails.currency") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select from list: USD, EUR, GBP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            {errors.bankDetails?.currency && (
              <p className="text-red-500 text-[12px]">{errors.bankDetails.currency.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Mark as Primary *</Label>
          <RadioGroup
            onValueChange={(value) => setValue("bankDetails.isPrimary", value)}
            value={watch("bankDetails.isPrimary") || ""}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="primary-yes" />
              <Label htmlFor="primary-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="primary-no" />
              <Label htmlFor="primary-no">No</Label>
            </div>
          </RadioGroup>
          {errors.bankDetails?.isPrimary && (
            <p className="text-red-500 text-[12px]">{errors.bankDetails.isPrimary.message}</p>
          )}
        </div>

        {/* Payment Terms */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Accepted Currencies *</Label>
              <MultiSelect
                options={[
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "GBP", label: "GBP" },
                ]}
                value={acceptedCurrencies}
                onChange={(newValue) => setValue("paymentTerms.acceptedCurrencies", newValue)}
                placeholder="Select currencies: USD, EUR, GBP"
              />
              {errors.paymentTerms?.acceptedCurrencies && (
                <p className="text-red-500 text-[12px]">{errors.paymentTerms.acceptedCurrencies.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms.upfront">Upfront/Advance *</Label>
                <Input
                  id="paymentTerms.upfront"
                  placeholder="Enter percentage (e.g., 30)"
                  type="number"
                  {...register("paymentTerms.upfront")}
                />
                {errors.paymentTerms?.upfront && (
                  <p className="text-red-500 text-[12px]">{errors.paymentTerms.upfront.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms.onDelivery">On Delivery *</Label>
                <Input
                  id="paymentTerms.onDelivery"
                  placeholder="Enter percentage (e.g., 70)"
                  type="number"
                  {...register("paymentTerms.onDelivery")}
                />
                {errors.paymentTerms?.onDelivery && (
                  <p className="text-red-500 text-[12px]">{errors.paymentTerms.onDelivery.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Custom Payment Terms</Label>
                <p className="text-sm text-muted-foreground">
                  Add custom payment terms (e.g., 60 days 40%)
                </p>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-7 gap-4 items-end"
                >
                  <div className="col-span-3 space-y-2">
                    <Label>Days</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 60"
                      {...register(`paymentTerms.customTerms.${index}.days`)}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label>Percentage</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 40"
                      {...register(`paymentTerms.customTerms.${index}.percentage`)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append({ days: "", percentage: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Term
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              <p>Current Payment Terms: {formatPaymentTerms()}</p>
              <p>Total: {calculateTotalPercentage()}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Configuration */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Shipping Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Shipping Regions</Label>
                <MultiSelect
                  options={[
                    { value: "north-america", label: "North America" },
                    { value: "europe", label: "Europe" },
                    { value: "asia", label: "Asia" },
                  ]}
                  value={shippingRegions}
                  onChange={(newValue) => setValue("shipping.regions", newValue)}
                  placeholder="For international wire transfers"
                />
              </div>
              <div className="space-y-2">
                <Label>Carrier Partnerships</Label>
                <MultiSelect
                  options={[
                    { value: "fedex", label: "FedEx" },
                    { value: "ups", label: "UPS" },
                    { value: "dhl", label: "DHL" },
                  ]}
                  value={shippingCarriers}
                  onChange={(newValue) => setValue("shipping.carriers", newValue)}
                  placeholder="Multi-select carriers"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};

export default Step4BankDetails;