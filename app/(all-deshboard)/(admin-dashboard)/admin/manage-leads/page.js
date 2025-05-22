"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLeads } from "@/lib/store/slices/leadSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const ManageLeads = () => {
  const dispatch = useDispatch();
  const { leads, loading, error, page, total, pages } = useSelector(
    (state) => state.lead
  );
  const token = useSelector((state) => state.admin.token); // Align with leadSlice

  // Log token for debugging
  useEffect(() => {
    console.log("Token:", token);
    if (!token) {
      console.error("No token found in admin state");
    }
    dispatch(fetchAllLeads({ page: 1, limit: 10 }));
  }, [dispatch, token]);

  return (
    <div className="container mx-auto min-h-[100vh] p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Leads</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-6 w-6 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Leads List */}
      {!loading && !error && leads.length === 0 && (
        <p className="text-center text-gray-500">No leads found.</p>
      )}

      {!loading && !error && leads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <Card key={lead._id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {lead.firstName} {lead.lastName}
                </CardTitle>
                <p className="text-sm text-gray-500">{lead.organization}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {lead.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Sector:</span>{" "}
                    {lead.sector.charAt(0).toUpperCase() + lead.sector.slice(1)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Interests:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lead.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4">
                  <Link href={`/admin/manage-leads/${lead._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination (if applicable) */}
      {!loading && !error && leads.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {leads.length} of {total} leads
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => dispatch(fetchAllLeads({ page: page - 1, limit: 10 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pages}
              onClick={() => dispatch(fetchAllLeads({ page: page + 1, limit: 10 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeads;