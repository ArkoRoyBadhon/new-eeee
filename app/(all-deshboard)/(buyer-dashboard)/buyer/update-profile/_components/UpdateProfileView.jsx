"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Eye, EyeOff, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { countries } from "@/lib/countries";
import Image from "next/image";
import { CountrySelect } from "@/app/(auth)/auth/_components/CountrySelect";
import { useSelector } from "react-redux";
import { uploadToCloudinary } from "@/utils/uploadCloudinary";
import { authApi } from "@/lib/api";

// Basic Info Schema
const basicInfoSchema = z.object({
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
});

// Security Schema
const securitySchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirmNewPassword: z.string().min(8, {
      message: "Please confirm your new password.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

const UpdateProfileView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+880");
  const [selectedCountry, setSelectedCountry] = useState("Bangladesh");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImgUpload, setprofileImgUpload] = useState([]);
  const [imagePreview, setImagePreview] = useState();
  const { user, token } = useSelector((state) => state.auth);

  // Basic Info Form
  const basicInfoForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      country: user?.country || "Bangladesh",
      phoneNumber: user?.phoneNumber.slice(5) || "",
    },
  });

  // Security Form
  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleCountryChange = (value) => {
    basicInfoForm.setValue("country", value);
    setSelectedCountry(value);
    const country = countries.find((c) => c.name === value);
    setPhoneCode(country ? country.code : "+880");
  };

  const onBasicInfoSubmit = async (values) => {
    setIsLoading(true);
    try {
      const formattedPhone = `${phoneCode}${values.phoneNumber}`;

      let profileImageUrl = null;
      if (profileImgUpload.length > 0) {
        try {
          const uploadResults = await Promise.all(
            profileImgUpload.map((file) => uploadToCloudinary(file))
          );
          profileImageUrl = uploadResults[0];
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          throw new Error("Failed to upload profile image");
        }
      }

      const payload = {
        ...values,
        phoneNumber: formattedPhone,
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      };

      const response = await authApi.updateProfile(token, payload);

      toast.success("Basic information saved successfully!", {
        duration: 3000,
      });

      return response;
    } catch (error) {
      toast.error("Failed to save information");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onSecuritySubmit = async (values) => {
    setSecurityLoading(true);
    try {
      console.log(values);
      if (values.currentPassword === values.newPassword) {
        toast.error("New password must be different from current password", {
          duration: 5000,
        });
        return;
      }

      const response = await authApi.updateProfile(token, values);

      toast.success("Password updated successfully!", {
        duration: 3000,
      });

      securityForm.reset();
    } catch (error) {
      toast.error("Failed to update password", {
        description: error.message || "Please check your details and try again",
        duration: 5000,
      });
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleProfileImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setprofileImgUpload([...profileImgUpload, ...newFiles]);

      const previewUrl = URL.createObjectURL(newFiles[0]);
      setImagePreview(previewUrl);
    }
  };

  // Get the selected country's flag
  const selectedCountryData =
    countries.find((c) => c.name === selectedCountry) ||
    countries.find((c) => c.name === "Bangladesh");

  console.log("uploaded image", user?.profileImage);

  return (
    <div className="min-h-[80vh] py-10">
      <Tabs defaultValue="basic" className="w-full h-full">
        <div className="flex flex-col lg:flex-row w-full lg:min-h-[40vh]">
          <div className="w-full lg:w-1/4 h-full ">
            <h4 className="text-[20px] text-center font-bold custom-text">
              Profile Setting
            </h4>
            <TabsList className="flex flex-row lg:flex-col gap-2 w-full bg-transparent px-4 mt-8">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-[#DFB547] data-[state=active]:font-bold h-10 px-4 py-4 w-full text-sm rounded-full lg:mt-6"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-[#DFB547] data-[state=active]:font-bold h-10 px-4 py-4 text-sm w-full rounded-full"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="w-full lg:w-3/4 h-fit px-6 border-l">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="flex-1 overflow-auto">
              <div className="mt-4 overflow-y-auto">
                <Form {...basicInfoForm}>
                  <form
                    onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
                    className="space-y-4"
                  >
                    <h4 className="text-[20px] font-bold custom-text">
                      Basic Info Update
                    </h4>
                    <div className="relative w-40 h-40">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#DFB547]">
                        <Image
                          src={
                            imagePreview ||
                            user?.profileImage ||
                            "/img/apple.webp"
                          }
                          height={160}
                          width={160}
                          alt="profile-img"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: "center" }}
                        />
                      </div>
                      <label
                        htmlFor="profile"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#DFB547] rounded-full text-white flex justify-center items-center cursor-pointer hover:bg-[#c9a03d] transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />{" "}
                      </label>
                      <input
                        id="profile"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* First and Last Name */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <FormField
                        control={basicInfoForm.control}
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
                        control={basicInfoForm.control}
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
                      control={basicInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              readOnly
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Country Selection */}
                    <FormField
                      control={basicInfoForm.control}
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

                    {/* Phone Number */}
                    <FormField
                      control={basicInfoForm.control}
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

                    <Button
                      type="submit"
                      className="w-auto bg-[#DFB547] cursor-pointer hover:bg-[#DFB547]/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Information"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="flex-1 overflow-auto">
              <div className="mt-4 overflow-y-auto w-full lg:w-[600px]">
                <Form {...securityForm}>
                  <form
                    onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                    className="space-y-4"
                  >
                    <h4 className="text-[20px] font-bold custom-text">
                      Password & Security
                    </h4>
                    {/* Current Password */}
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your current password"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                {showCurrentPassword ? (
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

                    {/* New Password */}
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
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

                    {/* Confirm New Password */}
                    <FormField
                      control={securityForm.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
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

                    <Button
                      type="submit"
                      className="w-auto bg-[#DFB547] cursor-pointer hover:bg-[#DFB547]/90"
                      disabled={securityLoading}
                    >
                      {securityLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default UpdateProfileView;
