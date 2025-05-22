import React from "react";
import logoImg from "/assets/Group 1000012072.png";
import playStoreImg from "../../public/assets/playstor.png";
import appStoreImg from "../../public/assets/app.png";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="bg-[#001C44] text-white">
      <div className="container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 py-[50px] lg:py-[100px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-[18px] col-span-2 lg:col-span-1 flex lg:block flex-col justify-center items-center text-center lg:text-start">
            <Image
              src={logoImg}
              alt="Logo"
              width={500}
              height={500}
              className="w-auto h-[60px]"
            />
            <div>
              <h3 className="text-sm font-normal mb-1">Call us</h3>
              <p className="text-lg font-bold ">123 388 80 90</p>
            </div>
            <div>
              <address className="text-sm font-normal">
                2972 gulshan Rd. Santa Ana, Lalmatia 85486{" "}
              </address>
            </div>
            <div className="flex items-center gap-4">
              <FaFacebook className="size-4.5 hover:text-[#DFB547] transition-all duration-150 ease-in" />
              <FaInstagram className="size-4.5 hover:text-[#DFB547] transition-all duration-150 ease-in" />
              <FaTiktok className="size-4.5 hover:text-[#DFB547] transition-all duration-150 ease-in" />
              <FaTwitter className="size-4.5 hover:text-[#DFB547] transition-all duration-150 ease-in" />
            </div>
          </div>
          <div className="flex lg:block flex-col items-center">
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li>Our Story</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="flex lg:block flex-col items-center">
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Legal</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 flex lg:block flex-col justify-center items-center text-center lg:text-start">
            <h3 className="text-lg font-bold mb-4">
              Sign up for our newsletter
            </h3>
            <p>
              Leave your email to get all service & news which benefit you most
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                autoComplete="email"
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DFB547] sm:text-sm/6"
              />
              <Button
                type="submit"
                className="flex-none rounded-md bg-[#DFB547] px-3.5 py-2.5 !font-bold text-stone-800 shadow-xs hover:bg-[#DFB547]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DFB547] transition-all duration-150 ease-in cursor-pointer"
              >
                Subscribe
              </Button>
            </div>
            <h2 className="text-lg font-bold mt-6">Coming soon</h2>
            <div>
              <div className="mt-6 flex gap-x-4">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.example.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={playStoreImg}
                    alt="Google Play Store"
                    width={150}
                    height={50}
                    className="hover:opacity-90 transition-all duration-150 ease-in"
                  />
                </Link>
                <Link
                  href="https://apps.apple.com/us/app/apple-store/id982107779"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={appStoreImg}
                    alt="Apple App Store"
                    width={150}
                    height={50}
                    className="hover:opacity-90 transition-all duration-150 ease-in"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

export const BottomFooter = () => {
  return (
    <div className="bg-[#000830] text-white h-[70px] flex items-center justify-center">
      <div className="container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 text-center">
        <div className="block lg:flex items-center justify-between h-full space-y-2.5 lg:space-y-0">
          <p className="text-sm font-normal text-start">
            © 2025 All rights reserved. Designed by{" "}
            <a href="#" className="text-[#DFB547]">
              King Mansa
            </a>
          </p>
          <div className="">
            <p className="text-sm font-normal flex items-center gap-2">
              <Link href="#" className="hover:text-[#DFB547]">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="#" className="hover:text-[#DFB547]">
                Terms of Use
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
