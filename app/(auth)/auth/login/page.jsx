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
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { authApi } from "@/lib/api";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import GuestRoute from "@/app/_components/GuestRoute";
import watermarkImg from "../../../../public/assets/watermark.png";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

const LoginPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const queryRole = searchParams.get("role");
  const [role, setRole] = useState(queryRole ?? "buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ ...data, role });

      localStorage.setItem("token", response.token);
      const userProfile = await authApi.getProfile(response.token);

      // Get the first role from the user's roles array
      const userRole = userProfile.role;

      dispatch(
        setCredentials({
          user: userProfile,
          token: response.token,
          selectedRole: userRole,
        })
      );

      toast.success(`Welcome back, ${userProfile.firstName}!`);

      // Redirect based on the actual user role
      if (userRole === "seller") {
        router.push("/seller/dashboard");
      } else if (userRole === "buyer") {
        router.push("/buyer/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorMsg = error.message.includes("Not authorized")
        ? "You don't have permission to login as this role"
        : error.message || "Invalid email or password";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestRoute>
      <div className="flex justify-center items-start my-[50px] md:my-[100px] ">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg md:shadow-[0_0px_15px_5px_rgba(0,0,0,0.1)] relative">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Sign in as <span className="capitalize">{role}</span>
            </h1>
          </div>

          {!queryRole && (
            <Tabs
              defaultValue={role}
              className="w-full mb-4"
              onValueChange={setRole}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer" className={`cursor-pointer`}>
                  Buyer
                </TabsTrigger>
                <TabsTrigger value="seller" className={`cursor-pointer`}>
                  Seller
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <div className="flex flex-col md:flex-row  items-center gap-6 py-4">
                <Button
                  type="submit"
                  className="w-auto bg-[#DFB547] cursor-pointer hover:bg-[#DFB547]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : `Sign in`}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Register
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

export default LoginPage;
