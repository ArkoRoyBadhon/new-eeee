"use client";

import { useEffect } from "react";
import { unauthorized, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { user, selectedRole } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      // router.push("/auth/login");
    } else if (allowedRoles && !allowedRoles.includes(selectedRole)) {
      unauthorized();
    }
  }, [user, selectedRole, router, allowedRoles]);

  if (!user || (allowedRoles && !allowedRoles.includes(selectedRole))) {
    return null;
  }

  return children;
}
