"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoImg from "../../public/assets/Group 1000012072.png";
import Image from "next/image";
import Link from "next/link";
import { CircleUser, ChevronDown, Logs, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/store/slices/authSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import SearchBar from "./searchBarVariants";

export default function MainNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isLoginPage = pathname === "/auth/login";
  const isRegisterPage = pathname === "/auth/register";

  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Update isScrolled based on 300px threshold
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const languages = [
    { name: "English", codeName: "EN", flag: "us" },
    { name: "Spanish", codeName: "ES", flag: "es" },
    { name: "Chinese", codeName: "CN", flag: "cn" },
  ];

  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  const isHomePage = pathname === "/";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const getUserInitials = () => {
    if (!user?.firstName) return "U";
    return `${user.firstName.charAt(0)}${
      user.lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  // Animation variants for the navbar
  const navbarVariants = {
    hidden: {
      y: -100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      backgroundColor: isHomePage ? "transparent" : "#001C44",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.3,
      },
    },
    scrolled: {
      y: 0,
      opacity: 1,
      backgroundColor: "rgba(0, 28, 68, 0.95)",
      backdropFilter: "blur(8px)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  // Animation variants for the container
  const containerVariants = {
    large: {
      height: 100,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
    small: {
      height: 80,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className={`top-0 w-full z-50 text-white shadow-xs shadow-gray-50/10 ${
        !isHomePage && !isScrolled ? "bg-[#001C44] sticky" : "fixed"
      }`}
      variants={navbarVariants}
      initial="hidden"
      animate={isScrolled ? "scrolled" : "visible"}
    >
      <motion.div
        className="container mx-auto px-5"
        variants={containerVariants}
        animate={isScrolled ? "small" : "large"}
      >
        <div className="flex items-center justify-between h-full">
          {/* Mobile menu button (left side) - shown when user is logged in */}
          {token ? (
            <div className="lg:hidden">
              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#DFB547] transition-all duration-150 ease-in"
                  >
                    <Menu className="size-6.5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[300px] rounded-none bg-[#001C44] text-white border-none">
                  <div className="p-4 space-y-6">
                    {/* Logo */}
                    <Link href="/" className="flex justify-center">
                      <Image
                        src={logoImg}
                        alt="Logo"
                        width={500}
                        height={500}
                        className="w-auto h-[60px]"
                      />
                    </Link>

                    {/* SearchBar - shown when scrolled past 300px */}
                    {isScrolled && (
                      <div className="flex justify-center">
                        <SearchBar />
                      </div>
                    )}

                    {/* User Profile */}
                    <div className="flex items-center gap-4 p-2 border-b border-white/20 pb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileURL} />
                        <AvatarFallback className="!text-[black]">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-300">{user?.email}</p>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                      <Link href={`/${user?.role}/dashboard`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-white/10"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-white/10"
                        >
                          Profile
                        </Button>
                      </Link>
                      {user?.role === "seller" && (
                        <Link href="/membership">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-white/10"
                          >
                            Membership
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-50/10"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-white/10 flex items-center gap-2.5"
                          >
                            <Logs className="size-4.5" /> All Categories
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[250px] bg-[#001C44] text-white border-white/20">
                          <DropdownMenuItem className="text-white hover:bg-white/10">
                            Category 1
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/10">
                            Category 2
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/10">
                            Category 3
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Link href="/supplier">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-white/10"
                        >
                          Become a Supplier
                        </Button>
                      </Link>

                      <Link href="/quotations">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-white/10"
                        >
                          Request for Quotations
                        </Button>
                      </Link>

                      {/* Language Selector */}
                      <DropdownMenu onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-white/10 flex items-center gap-2.5"
                          >
                            <Image
                              width={50}
                              height={50}
                              src={`https://flagcdn.com/${currentLanguage.flag}.svg`}
                              alt={currentLanguage.name}
                              className="w-6 h-4.5"
                            />
                            {currentLanguage.codeName}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isOpen ? "rotate-180" : ""
                              )}
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="min-w-[250px] bg-[#001C44] text-white border-white/20"
                        >
                          {languages.map((language, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              onClick={() => setCurrentLanguage(language)}
                              className="cursor-pointer flex items-center gap-3 text-white hover:bg-white/10"
                            >
                              <Image
                                width={50}
                                height={50}
                                src={`https://flagcdn.com/${language.flag}.svg`}
                                alt={language.name}
                                className="w-5 h-3.5"
                              />
                              <span className="flex-1">{language.name}</span>
                              <span className="text-gray-300">
                                {language.codeName}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          ) : (
            <Link href="/" className="lg:hidden">
              <motion.div
                animate={{
                  scale: isScrolled ? 0.9 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Image
                  src={logoImg}
                  alt="Logo"
                  width={500}
                  height={500}
                  className="w-auto h-[60px]"
                />
              </motion.div>
            </Link>
          )}

          {/* Logo (centered on mobile when logged in, left otherwise) */}
          <Link
            href="/"
            className={token ? "lg:ml-0 mx-auto lg:mx-0" : "hidden lg:block"}
          >
            <motion.div
              animate={{
                scale: isScrolled ? 0.9 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Image
                src={logoImg}
                alt="Logo"
                width={500}
                height={500}
                className="w-auto h-[60px]"
              />
            </motion.div>
          </Link>

          {/* SearchBar - shown only when scrolled past 300px */}
          {isScrolled && (
            <div className="hidden lg:flex flex-1 justify-center">
              <SearchBar />
            </div>
          )}

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Avatar (mobile - shown when logged in) */}
            {token && (
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full text-stone-600 font-semibold"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.profileURL}
                          alt={user?.firstName}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.profileURL}
                          alt={user?.firstName}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${user?.role}/dashboard`}
                        className="w-full cursor-pointer"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "seller" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/membership"
                          className="w-full cursor-pointer"
                        >
                          Membership
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                      onClick={handleLogout}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-col items-end justify-between gap-0.5">
              <div className="flex items-center gap-4">
                <DropdownMenu onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      className="text-white hover:bg-transparent bg-transparent cursor-pointer flex items-center gap-2.5 h-0 !py-4"
                    >
                      <Image
                        width={50}
                        height={50}
                        src={`https://flagcdn.com/${currentLanguage.flag}.svg`}
                        alt={currentLanguage.name}
                        className="w-6 h-4.5"
                      />
                      {currentLanguage.codeName}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[150px]">
                    {languages.map((language, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onClick={() => setCurrentLanguage(language)}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <Image
                          width={50}
                          height={50}
                          src={`https://flagcdn.com/${language.flag}.svg`}
                          alt={language.name}
                          className="w-5 h-3.5"
                        />
                        <span className="flex-1">{language.name}</span>
                        <span className="text-muted-foreground">
                          {language.codeName}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {token ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full text-stone-600 font-semibold"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.profileURL}
                            alt={user?.firstName}
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user?.profileURL}
                            alt={user?.firstName}
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${user?.role}/dashboard`}
                          className="w-full cursor-pointer"
                        >
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full cursor-pointer">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === "seller" && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/membership"
                            className="w-full cursor-pointer"
                          >
                            Membership
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                        onClick={handleLogout}
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    {!isLoginPage && (
                      <Link href="/auth/login">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-transparent cursor-pointer h-0 !py-4 px-[24px] font-semibold ease-in-out"
                        >
                          <CircleUser className="mr-1 h-4 w-4" /> Login
                        </Button>
                      </Link>
                    )}
                    {!isRegisterPage && (
                      <Link href="/auth/register">
                        <Button
                          type="button"
                          className="w-auto bg-[#DFB547] cursor-pointer hover:bg-[#DFB547]/90 rounded-full text-stone-800 h-0 !py-4 px-[24px] font-bold"
                        >
                          Register
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-6 text-white/90 text-[14px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      className="text-white/90 hover:bg-transparent bg-transparent cursor-pointer flex items-center gap-2.5 text-[14px] font-normal h-0 !py-4"
                    >
                      <Logs className="size-4.5" /> All Categories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[300px]" align="end">
                    <DropdownMenuItem>Category 1</DropdownMenuItem>
                    <DropdownMenuItem>Category 2</DropdownMenuItem>
                    <DropdownMenuItem>Category 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/supplier"
                  className="hover:text-gray-300 transition-colors"
                >
                  Become a Supplier
                </Link>

                <Link
                  href="/quotations"
                  className="hover:text-gray-300 transition-colors"
                >
                  Request for Quotations
                </Link>
              </div>
            </div>

            {/* Mobile auth buttons (shown when not logged in) */}
            {!token && (
              <div className="lg:hidden flex items-center gap-2">
                {!isLoginPage && (
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                    >
                      <CircleUser className="size-5" />
                    </Button>
                  </Link>
                )}
                {!isRegisterPage && (
                  <Link href="/auth/register">
                    <Button
                      size="sm"
                      className="bg-[#DFB547] hover:bg-[#DFB547]/90 text-stone-800"
                    >
                      Register
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
