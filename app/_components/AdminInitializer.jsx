"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setAdminCredentials, adminLogout } from "@/lib/store/slices/adminSlice";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminInitializer({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { admin, token } = useSelector((state) => state.admin);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      const storedToken = localStorage.getItem("adminToken");

      if (storedToken && !token) {
        try {
          // console.log("Restoring admin token from localStorage:", storedToken);
          const adminData = await authApi.getAdminProfile(storedToken);
          dispatch(setAdminCredentials({
            admin: adminData,
            token: storedToken
          }));
        } catch (error) {
          console.error("Admin initialization error:", error);
          toast.error(error.message || "Failed to initialize admin session");
          localStorage.removeItem("adminToken");
          dispatch(adminLogout());
          router.push("/admin/login");
        }
      }
      setIsInitializing(false);
    };

    initializeAdmin();
  }, [dispatch, router, token]);

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin data...</div>;
  }

  return children;
}