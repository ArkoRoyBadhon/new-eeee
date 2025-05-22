"use client";

import { CheckSquare, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ContactSection() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <motion.div
      ref={ref}
      className="bg-[#fff] container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 my-[100px]"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div
        className="rounded créativité[16px] shadow-[0px_0px_12px_3px_#00000012] p-6 md:px-[60px] md:py-[80px]"
        style={{
          backgroundImage: `linear-gradient(360deg, #ffffffb9 0%, #fff 100%), url("assets/contectBG.png")`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 min-h-[340px]"
          variants={containerVariants}
        >
          <motion.div
            className="flex flex-col justify-center gap-20 h-full"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-[32px] font-bold mb-1">
                Tell us About Your Business Needs
              </h2>
              <p>
                Our expert team will deliver tailored solutions to your
                export-import challenges.
              </p>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <h6 className="text-[20px] font-bold">Phone / Email</h6>
              <div className="flex items-center gap-2">
                <Mail className="size-5" />
                <span>0i6K6@example.com</span>
              </div>
              <div className="rounded-full h-[40px] bg-[#34B12C] text-white flex items-center gap-2 max-w-[200px] justify-center">
                <FaWhatsapp className="size-5" /> Chat on Whatsapp
              </div>
            </motion.div>
            <motion.div
              className="flex items-start gap-2"
              variants={itemVariants}
            >
              <CheckSquare className="size-4" />
              <div>
                This site is protected by reCAPTCHA and the Google{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  className="text-[#DFB547] font-bold hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                and
                <Link
                  href="https://policies.google.com/terms"
                  className="text-[#DFB547] font-bold hover:underline"
                >
                  {" "}
                  Terms of Service
                </Link>{" "}
                apply.
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="bg-white rounded-[16px] shadow-[0px_0px_12px_3px_#00000012] p-8"
            variants={itemVariants}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your business needs..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#DFB547] rounded-full h-[46px] text-stone-800 hover:bg-[#DFB547]/90 cursor-pointer"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}