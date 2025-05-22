"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { authApi } from "@/lib/api";

const authRoutes = ["/auth/login", "/auth/register"];

export default function AuthInitializer({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem("token");
        
        if (storedToken) {
          try {
            const userData = await authApi.getProfile(storedToken);
            const userRole = userData.role;
            
            dispatch(
              setCredentials({
                user: userData,
                token: storedToken,
                selectedRole: userRole
              })
            );
            
            if (authRoutes.includes(pathname)) {
              const previousRoute = sessionStorage.getItem('previousRoute');
              if (previousRoute && previousRoute.startsWith(`/${userRole}`)) {
                router.push(previousRoute);
              } else {
                router.push(`/${userRole}/dashboard`);
              }
            }
          } catch (error) {
            console.error("Failed to load user profile:", error);
            localStorage.removeItem("token");
            // Clear Redux state if token is invalid
            dispatch(setCredentials({ user: null, token: null, selectedRole: null }));
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeAuth();
  }, [dispatch, router, pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!authRoutes.includes(pathname)) {
        sessionStorage.setItem('previousRoute', pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  if (isLoading) {
    return null;
  }

  if (token && authRoutes.includes(pathname)) {
    return null;
  }

  return children;
}