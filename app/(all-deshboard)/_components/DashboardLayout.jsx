// D:\DataPollex\king-mansa\client\app\(all-deshboard)\_components\DashboardLayout.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Mail, LogOut, ListCollapse, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import logoImg from "../../../public/assets/Group 1000012072.png";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/store/slices/authSlice";
import { adminLogout } from "@/lib/store/slices/adminSlice";
import { BottomFooter } from "@/app/_components/Footer";
import DImage from "../../../public/assets/NavIcone.png";
import { toast } from "sonner";

// const roleBasedMenuItems = {
//   seller: [
//     {
//       name: "Home",
//       icon: Home,
//       path: "/seller/dashboard",
//       relatedPaths: ["/seller/dashboard", "/seller/dashboard/todo"],
//     },
//     {
//       name: "Shop",
//       icon: ShoppingBag,
//       path: "/seller/shop",
//       relatedPaths: ["/seller/shop"],
//     },
//     {
//       name: "Products",
//       icon: Box,
//       path: "/seller/dashboard/products",
//       relatedPaths: ["/seller/dashboard/products"],
//     },
//     {
//       name: "Communications",
//       icon: Mail,
//       path: "/seller/dashboard/message",
//       relatedPaths: ["/seller/dashboard/message"],
//     },
//     {
//       name: "Orders",
//       icon: ShoppingCart,
//       path: "/seller/dashboard/orders",
//       relatedPaths: ["/seller/dashboard/orders"],
//     },
//     {
//       name: "Campaigns",
//       icon: Megaphone,
//       path: "/seller/campaigns",
//       relatedPaths: ["/seller/campaigns"],
//     },
//     {
//       name: "Company & Site",
//       icon: Building2,
//       path: "/seller/company",
//       relatedPaths: ["/seller/company"],
//     },
//     {
//       name: "Logistics",
//       icon: Truck,
//       path: "/seller/logistics",
//       relatedPaths: ["/seller/logistics"],
//     },
//     {
//       name: "Customs Clearance",
//       icon: FileSearch,
//       path: "/seller/customs",
//       relatedPaths: ["/seller/customs"],
//     },
//     {
//       name: "Help Center",
//       icon: HelpCircle,
//       path: "/seller/help",
//       relatedPaths: ["/seller/help"],
//     },
//   ],
//   buyer: [
//     {
//       name: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/buyer/dashboard",
//       relatedPaths: ["/buyer/dashboard", "/buyer/dashboard/todo"],
//     },
//     {
//       name: "Message",
//       icon: MessageSquareText,
//       path: "/buyer/dashboard/message",
//       relatedPaths: ["/buyer/dashboard/message"],
//     },
//     {
//       name: "My Orders",
//       icon: ShoppingCart,
//       path: "/buyer/dashboard/my-orders",
//       relatedPaths: ["/buyer/dashboard/my-orders"],
//     },
//     {
//       name: "Buying Leads",
//       icon: Handshake,
//       path: "/buyer/dashboard/buying-leads",
//       relatedPaths: ["/buyer/dashboard/buying-leads"],
//     },
//     {
//       name: "Transactions",
//       icon: ArrowLeftRight,
//       path: "/buyer/dashboard/transactions",
//       relatedPaths: ["/buyer/dashboard/transactions"],
//     },
//     {
//       name: "Update Profile",
//       icon: CircleUser,
//       path: "/buyer/dashboard/update-profile",
//       relatedPaths: ["/buyer/dashboard/update-profile"],
//     },
//   ],
// };
import { roleBasedMenuItems } from "@/lib/RoleBaseMenuItems";
import Notification from "@/app/_components/Notification";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { subscriptions } = useSelector((state) => state.subscriptions);

  let userRole;
  if (pathname.startsWith("/seller")) {
    userRole = "seller";
  } else if (pathname.startsWith("/buyer")) {
    userRole = "buyer";
  } else if (pathname.startsWith("/admin")) {
    userRole = "admin";
  }

  const menuItems = roleBasedMenuItems[userRole] || [];

  useEffect(() => {
    if (!isDesktop) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isDesktop]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (userRole === "admin") {
      dispatch(adminLogout());
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } else {
      dispatch(logout());
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      router.push("/auth/login");
    }
  };

  const isActive = (item) => {
    return item.relatedPaths.some((path) => pathname.startsWith(path));
  };

  return (
    <div className="flex h-screen">
      {isDesktop && (
        <aside
          className={`h-full bg-white transition-all duration-300 ease-in-out ${
            isOpen ? "w-64" : "w-20"
          } fixed`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-[#001C44] h-[92px] px-4">
              {isOpen && (
                <div className="flex items-center">
                  <Link href="/">
                    <Image
                      src={logoImg}
                      alt="KING MANSA"
                      width={120}
                      height={40}
                      className="mr-2"
                    />
                  </Link>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleDrawer}
                className="ml-auto cursor-pointer text-white hover:text-stone-800"
              >
                {isOpen ? (
                  <ListCollapse className="size-6 rotate-180 " />
                ) : (
                  <ListCollapse className="size-6 " />
                )}
              </Button>
            </div>

            <nav className="flex-1 p-4 border-r overflow-y-auto">
              <ul className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                  <Link key={index} href={item.path} className="">
                    <li>
                      <Button
                        variant={isActive(item) ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          isOpen ? "px-4" : "px-2"
                        } ${
                          isActive(item)
                            ? "bg-[#001C44] text-white hover:bg-[#001C44]/90"
                            : "bg-gray-100/30"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isActive(item) ? "text-[#DFB547]" : ""
                          }`}
                        />
                        {isOpen && (
                          <span className="ml-3 text-sm">{item.name}</span>
                        )}
                      </Button>
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>

            <div className="mt-auto px-4 py-2 border-r">
              {isOpen && (
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 mb-2 text-red-500 hover:text-red-600 bg-gray-100/50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3 text-sm">Logout</span>
                </Button>
              )}
              <Button
                variant="ghost"
                className={`w-full justify-start ${isOpen ? "px-4" : "px-2"}`}
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium">HA</span>
                </div>
                {isOpen && <span className="ml-3 text-sm">Hussain ahmad</span>}
              </Button>
            </div>
          </div>
        </aside>
      )}

      <div className="flex flex-col flex-1">
        <header
          className={`bg-[#001C44] shadow flex items-center fixed z-10 text-white h-[92px] ${
            isDesktop ? (isOpen ? "left-64" : "left-20") : "left-0"
          } right-0 transition-all duration-300 ease-in-out `}
        >
          <div className="flex items-center justify-between w-full container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8">
            <div className="flex items-center">
              {(!isDesktop || !isOpen) && (
                <>
                  {!isDesktop && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mr-4 cursor-pointer"
                        >
                          <ListCollapse className="size-6" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-64 p-0">
                        <div className="flex flex-col h-full p-4">
                          <div className="flex items-center justify-between mb-4">
                            <Link href="/">
                              <div className="bg-[#001C44] rounded p-2">
                                <Image
                                  src={logoImg}
                                  alt="KING MANSA"
                                  width={120}
                                  height={40}
                                />
                              </div>
                            </Link>
                          </div>
                          <nav className="flex-1">
                            <ul className="space-y-2">
                              {menuItems.map((item, index) => (
                                <li key={index}>
                                  <Button
                                    variant={
                                      isActive(item) ? "default" : "ghost"
                                    }
                                    className={`w-full justify-start px-4 ${
                                      isActive(item)
                                        ? "bg-[#001C44] text-white hover:bg-[#001C44]/90"
                                        : "bg-gray-100/30"
                                    }`}
                                  >
                                    <item.icon
                                      className={`h-5 w-5 ${
                                        isActive(item) ? "text-[#DFB547]" : ""
                                      }`}
                                    />
                                    <span className="ml-3 text-sm">
                                      {item.name}
                                    </span>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </nav>
                          <div className="mt-auto pt-4 border-t">
                            <Button
                              variant="ghost"
                              className="w-full justify-start px-4 mb-2 text-red-500 hover:text-red-600 bg-gray-100/50"
                              onClick={handleLogout}
                            >
                              <LogOut className="h-5 w-5" />
                              <span className="ml-3 text-sm">Logout</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start px-4"
                            >
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs font-medium">HA</span>
                              </div>
                              <span className="ml-3 text-sm">
                                Hussain ahmad
                              </span>
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}
                  <Link href="/">
                    <Image
                      src={logoImg}
                      alt="KING MANSA"
                      width={120}
                      height={40}
                      className="mr-2"
                    />
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-10">
              <div className="relative">
                <Mail className="size-6" />
                <div className="absolute size-3 bg-[#05A72C] rounded-full -top-1 -right-1.5 border-[2px] border-white" />
              </div>

              {/* Notification Component */}
              <Notification userRole={userRole} />

              <div className="flex items-center gap-1">
                <Image
                  src={DImage}
                  alt="icon"
                  width={120}
                  height={40}
                  className="mr-2 h-[45px] w-auto"
                />
                <span className="font-semibold">Trade PRO</span>
                <ChevronDown className="size-4" />
              </div>
            </div>
          </div>
        </header>

        <main
          className={`flex-1 mt-[92px] transition-all duration-300 ease-in-out ${
            isDesktop ? (isOpen ? "ml-64" : "ml-20") : "ml-0"
          } `}
        >
          {children}
          <BottomFooter />
        </main>
      </div>
    </div>
  );
}
