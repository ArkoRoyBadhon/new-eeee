"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  fetchAllStores,
  updateStoreStatus,
} from "@/lib/store/slices/storeSetupSlice";
import { toast } from "sonner";
import ManageBusiness from "../_components/manage-business/ManageBusiness";

const ManageBusinessesPage = () => {
  const dispatch = useDispatch();
  const { stores, total, page, pages, loading, error } = useSelector(
    (state) => state.storeSetup
  );
  const { token } = useSelector((state) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch stores on mount and when page or status changes
  useEffect(() => {
    if (token) {
      dispatch(
        fetchAllStores({ page: currentPage, limit: 10, status: statusFilter })
      );
    }
  }, [token, dispatch, currentPage, statusFilter]);

  // Handle approve/reject actions
  const handleStatusUpdate = async (storeId, status, rejectionReasons = []) => {
    try {
      await dispatch(
        updateStoreStatus({ storeId, status, rejectionReasons })
      ).unwrap();
      toast.success(`Store ${status} successfully`);
    } catch (err) {
      toast.error(err || "Failed to update store status");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setCurrentPage(newPage);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[100vh] p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Businesses</h1>

      {/* Status Filter */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <ManageBusiness
              key={store._id}
              store={store}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No stores found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div>
            <p>
              Showing {stores.length} of {total} stores
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBusinessesPage;
