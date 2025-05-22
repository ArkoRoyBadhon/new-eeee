"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout } from "@/lib/store/slices/adminSlice";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import { fetchAllLeads } from "@/lib/store/slices/leadSlice";
import { fetchAllCatalogs } from "@/lib/store/slices/catalogSlice";
import { fetchAllStores } from "@/lib/store/slices/storeSetupSlice";
import { fetchSubscriptionRequests } from "@/lib/store/slices/subscriptionSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const { leads, total: leadTotal, loading: leadLoading } = useSelector(
    (state) => state.lead
  );
  const { catalogs, total: catalogTotal, loading: catalogLoading } = useSelector(
    (state) => state.catalog
  );
  const { stores, total: storeTotal, loading: storeLoading } = useSelector(
    (state) => state.storeSetup
  );
  const { subscriptions, loading: subscriptionLoading } = useSelector(
    (state) => state.subscriptions
  );

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchAllLeads({ page: 1, limit: 10 }));
    dispatch(fetchAllCatalogs({ page: 1, limit: 10 }));
    dispatch(fetchAllStores({ page: 1, limit: 10 }));
    dispatch(fetchSubscriptionRequests());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold">{admin.name?.en}</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {admin.role}
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Admin Information Card */}
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Admin Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Role: {admin.role}</p>
            <p>Email: {admin.email}</p>
            <p>Access: {admin.access_list?.length} permissions</p>
          </CardContent>
        </Card>

        {/* Leads Card */}
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {leadLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <p>Total Leads: {leadTotal || 0}</p>
            )}
          </CardContent>
        </Card>

        {/* Catalogs Card */}
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Catalogs</CardTitle>
          </CardHeader>
          <CardContent>
            {catalogLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <p>Total Catalogs: {catalogTotal || 0}</p>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <p>Total Requests: {subscriptions.length || 0}</p>
            )}
          </CardContent>
        </Card>

        {/* Business/Store Card */}
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Business/Store</CardTitle>
          </CardHeader>
          <CardContent>
            {storeLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <p>Total Stores: {storeTotal || 0}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}