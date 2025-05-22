"use client";

import React from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countries } from "@/lib/countries";

const Step2ContactDetails = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <CardHeader className="px-0 mb-2">
        <CardTitle className="text-2xl font-bold">Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Business Email and Phone Number */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessEmail">Business Email *</Label>
            <Input
              id="businessEmail"
              placeholder="e.g., contact@mansa.com"
              {...register("businessEmail")}
            />
            {errors.businessEmail && (
              <p className="text-red-500 text-[12px]">
                {errors.businessEmail.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              placeholder="e.g., +1234567890"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-[12px]">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Address Fields */}
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input
            id="addressLine1"
            placeholder="Street"
            {...register("addressLine1")}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-[12px]">
              {errors.addressLine1.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            placeholder="Street"
            {...register("addressLine2")}
          />
          {errors.addressLine2 && (
            <p className="text-red-500 text-[12px]">
              {errors.addressLine2.message}
            </p>
          )}
        </div>

        {/* City, Postal Code, and Country */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="e.g., New York"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-red-500 text-[12px]">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              placeholder="Postal code"
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-[12px]">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            onValueChange={(value) => setValue("country", value)}
            value={watch("country") || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-red-500 text-[12px]">{errors.country.message}</p>
          )}
        </div>

        {/* Contact Person */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Contact Person for B2B Meeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson.name">Name of the person *</Label>
                <Input
                  id="contactPerson.name"
                  placeholder="Enter Name"
                  {...register("contactPerson.name")}
                />
                {errors.contactPerson?.name && (
                  <p className="text-red-500 text-[12px]">
                    {errors.contactPerson.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson.designation">
                  Designation in Company: *
                </Label>
                <Input
                  id="contactPerson.designation"
                  placeholder="Designation in Company"
                  {...register("contactPerson.designation")}
                />
                {errors.contactPerson?.designation && (
                  <p className="text-red-500 text-[12px]">
                    {errors.contactPerson.designation.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson.mobile">Mobile Number: *</Label>
                <Input
                  id="contactPerson.mobile"
                  placeholder="Mobile Number"
                  {...register("contactPerson.mobile")}
                />
                {errors.contactPerson?.mobile && (
                  <p className="text-red-500 text-[12px]">
                    {errors.contactPerson.mobile.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson.email">Email Address: *</Label>
                <Input
                  id="contactPerson.email"
                  placeholder="Email Address"
                  {...register("contactPerson.email")}
                />
                {errors.contactPerson?.email && (
                  <p className="text-red-500 text-[12px]">
                    {errors.contactPerson.email.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};

export default Step2ContactDetails;
