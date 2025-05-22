"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionRequests } from "@/lib/store/slices/subscriptionSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubscribersDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { subscriptions, status, error } = useSelector((state) => state.subscriptions);
  const { token } = useSelector((state) => state.admin);

  const approvedSubscribers = subscriptions.filter((sub) => sub.status === "approved");

  useEffect(() => {
    if (token) {
      console.log("Fetching subscriptions with admin token:", token);
      dispatch(fetchSubscriptionRequests());
    } else {
      console.warn("No admin token found, redirecting to admin login");
      toast.error("Please log in as an admin to view subscribers");
      router.push("/admin/login");
    }
  }, [dispatch, token, router]);

  useEffect(() => {
    if (error) {
      console.error("Subscription Fetch Error:", error);
      if (error.includes("authentication required") || error.includes("Not authorized")) {
        toast.error("Admin session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } else {
        toast.error(error || "Failed to fetch subscribers");
      }
    }
    console.log("Subscriptions state:", subscriptions);
    console.log("Approved subscribers:", approvedSubscribers);
  }, [error, subscriptions, approvedSubscribers, router]);

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Active Subscribers</h1>

      {status === "loading" ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : approvedSubscribers.length === 0 ? (
        <p>No active subscribers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedSubscribers.map((subscriber) => (
            <Card key={subscriber._id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl capitalize">{subscriber.plan} Subscriber</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>User:</strong>{" "}
                  {subscriber.user?.firstName || "N/A"} {subscriber.user?.lastName || ""}
                </p>
                <p>
                  <strong>Email:</strong> {subscriber.user?.email || "N/A"}
                </p>
                <p>
                  <strong>Company:</strong> {subscriber.user?.companyName || "N/A"}
                </p>
                <p>
                  <strong>Approved:</strong>{" "}
                  {subscriber.updatedAt
                    ? new Date(subscriber.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}