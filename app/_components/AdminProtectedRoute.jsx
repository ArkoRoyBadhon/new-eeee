"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute({
  children,
  allowedRoles = ["admin"],
}) {
  const router = useRouter();
  const { admin, token } = useSelector((state) => state.admin);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("adminToken");

      if (!storedToken) {
        console.warn("No admin token found, redirecting to login");
        router.push("/admin/login");
        setIsChecking(false);
        return;
      }

      if (admin) {
        if (
          !allowedRoles.some((role) =>
            admin.role?.toLowerCase().includes(role.toLowerCase())
          )
        ) {
          console.warn("Unauthorized role:", admin.role);
          router.push("/admin/unauthorized");
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [admin, token, router, allowedRoles]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return children;
}
