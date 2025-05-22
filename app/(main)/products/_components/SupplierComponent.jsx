"use client";

import { fetchAllStoresForAll } from "@/lib/store/slices/storeSetupSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationFooter from "@/app/_components/PaginationFooter";
import { useRouter } from "next/navigation";

const SupplierComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { stores, total, page, pages, loading, error } = useSelector(
    (state) => state.storeSetup
  );
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(
      fetchAllStoresForAll({
        page: currentPage,
        limit: 12,
      })
    );
  }, [dispatch, currentPage]);

  const handleRefresh = () => {
    setCurrentPage(1);
    dispatch(
      fetchAllStoresForAll({
        page: 1,
        limit: 12,
      })
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">Error loading stores: {error}</p>
        <Button onClick={handleRefresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-lg" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-muted-foreground">No suppliers found</p>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <Card
                onClick={() => router.push(`/stores/${store._id}`)}
                key={store._id}
                className="custom-shadow cursor-pointer hover:bg-[#FDF5E5] transition-all duration-300 ease-in-out"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={store.storeLogo} />
                      <AvatarFallback>
                        {store.storeName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none line-clamp-1">
                        {store.storeName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {store.country}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className=" space-y-4">
                  <div className="space-y-2">
                    <p className="text-[18px] font-medium text-[#222222]">
                      Contact
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {store.contactPerson.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {store.contactPerson.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {store.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[18px] font-medium text-[#222222]">
                      Business
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm capitalize">
                        <span className="font-semibold">Type: </span>
                        {store?.legalStatus.replace(/-/g, " ")}
                      </p>
                      <p className="text-sm capitalize">
                        <span className="font-semibold">Sector: </span>
                        {store?.businessSector}
                      </p>
                    </div>
                  </div>

                  {store.shipping?.regions?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Shipping Regions
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {store.shipping.regions.map((region) => (
                          <Badge
                            key={region}
                            variant="secondary"
                            className="text-xs capitalize bg-[#FDF5E5]"
                          >
                            {region.replace(/-/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                {/* <CardFooter className="flex justify-end pt-2 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter> */}
              </Card>
            ))}
          </div>

          {total && (
            <div className="mt-6">
              <PaginationFooter
                totalItems={total}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupplierComponent;
