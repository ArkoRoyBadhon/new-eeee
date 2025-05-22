"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionRequests, manageSubscription } from "@/lib/store/slices/subscriptionSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ManageSubscriptionsDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { subscriptions, status, error } = useSelector((state) => state.subscriptions);
  const { token } = useSelector((state) => state.admin);

  // Fetch subscriptions if token is available
  useEffect(() => {
    if (token) {
      console.log("Fetching subscriptions with admin token:", token);
      dispatch(fetchSubscriptionRequests());
    } else {
      console.warn("No admin token found, redirecting to admin login");
      toast.error("Please log in as an admin to view subscriptions");
      router.push("/admin/login");
    }
  }, [dispatch, token, router]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Subscription Fetch Error:", error);
      if (error.includes("authentication required") || error.includes("Not authorized")) {
        toast.error("Admin session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } else {
        toast.error(error || "Failed to fetch subscriptions");
      }
    }
    console.log("Current subscriptions state:", subscriptions);
  }, [error, subscriptions, dispatch, router]);

  const handleManageSubscription = async (subscriptionId, status) => {
    try {
      const result = await dispatch(manageSubscription({ id: subscriptionId, status })).unwrap();
      toast.success(result.message);
    } catch (err) {
      console.error(`Manage Subscription Error for ID ${subscriptionId}:`, err);
      toast.error(err || `Failed to ${status} subscription`);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Manage Subscriptions</h1>

      {status === "loading" ? (
        <p>Loading subscriptions...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : subscriptions.length === 0 ? (
        <p>No subscription requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription._id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl capitalize">{subscription.plan} Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>User:</strong> {subscription.user?.firstName} {subscription.user?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {subscription.user?.email}
                </p>
                <p>
                  <strong>Company:</strong> {subscription.user?.companyName || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`capitalize ${
                      subscription.status === "pending"
                        ? "text-yellow-600"
                        : subscription.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {subscription.status}
                  </span>
                </p>
                <p>
                  <strong>Requested:</strong>{" "}
                  {new Date(subscription.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-4">
                {subscription.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleManageSubscription(subscription._id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleManageSubscription(subscription._id, "rejected")}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}