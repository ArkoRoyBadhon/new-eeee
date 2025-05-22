"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { countries } from "@/lib/countries";
import Image from "next/image";
import { CountrySelect } from "../_components/CountrySelect";
import GuestRoute from "@/app/_components/GuestRoute";
import watermarkImg from "../../../../public/assets/watermark.png";
import { authApi } from "@/lib/api";

const formSchema = z
  .object({
    companyName: z.string().min(2, {
      message: "Company name must be at least 2 characters.",
    }),
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    country: z.string().min(1, {
      message: "Please select a country.",
    }),
    phoneNumber: z.string().min(6, {
      message: "Please enter a valid phone number.",
    }),
    role: z.array(z.string()).nonempty({
      message: "Please select at least one trade role.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+880");
  const [selectedCountry, setSelectedCountry] = useState("Bangladesh");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      country: "Bangladesh",
      phoneNumber: "",
      role: [],
      password: "",
      confirmPassword: "",
    },
  });

  const handleCountryChange = (value) => {
    form.setValue("country", value);
    setSelectedCountry(value);
    const country = countries.find((c) => c.name === value);
    setPhoneCode(country ? country.code : "+880");
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const formattedPhone = `${phoneCode}${values.phoneNumber}`;

      await authApi.register({
        ...values,
        phoneNumber: formattedPhone,
      });

      toast.success(`Registration successful! Welcome ${values.firstName}`, {
        description: `You've registered as ${values.role.join(" and ")}`,
        duration: 3000,
      });

      router.push("/auth/login");
    } catch (error) {
      toast.error("Registration failed", {
        description: error.message || "Please check your details and try again",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the selected country's flag
  const selectedCountryData =
    countries.find((c) => c.name === selectedCountry) ||
    countries.find((c) => c.name === "Bangladesh");

  return (
    <GuestRoute>
      <div className="flex justify-center items-start md:my-[100px] my-[50px] ">
        <div className="w-full max-w-2xl px-6 py-4 space-y-6 bg-white rounded-lg md:shadow-[0_0px_15px_5px_rgba(0,0,0,0.1)] relative">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Country Selection */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country / Region</FormLabel>
                    <CountrySelect
                      value={field.value}
                      onChange={handleCountryChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trade Roles */}
              <div className="space-y-2">
                <FormLabel>Please select trade role</FormLabel>
                <div className="flex items-center gap-4">
                  {["buyer", "seller"].map((role, idx) => (
                    <FormField
                      key={idx}
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="data-[state=checked]:bg-[#DFB547] data-[state=checked]:border-[#DFB547] hover:border-[#DFB547]"
                              checked={field.value?.includes(role)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, role])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== role
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {role}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                {form.formState.errors.role && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* First and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <div className="flex">
                      <div className="inline-flex items-center w-32 justify-center rounded-l-md border border-r-0 border-input bg-muted text-sm gap-2">
                        {selectedCountryData && (
                          <Image
                            src={`https://flagcdn.com/${selectedCountryData.flag}.svg`}
                            alt={selectedCountryData.name}
                            width={50}
                            height={50}
                            className="w-auto h-4.5 rounded-xs"
                          />
                        )}
                        <span>{phoneCode}</span>
                      </div>
                      <FormControl>
                        <Input
                          className="rounded-l-none"
                          placeholder="Phone number"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row items-center gap-6 py-4">
                <Button
                  type="submit"
                  className="w-auto bg-[#DFB547] cursor-pointer hover:bg-[#DFB547]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create an account"}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="absolute -top-44 -right-40 -z-1 lg:block hidden">
            <Image src={watermarkImg} alt="Logo" width={300} height={300} />
          </div>
        </div>
      </div>
    </GuestRoute>
  );
};

export default RegisterPage;
