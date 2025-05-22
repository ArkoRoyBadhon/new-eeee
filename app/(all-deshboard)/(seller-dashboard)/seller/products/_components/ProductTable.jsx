"use client";

import { useState } from "react";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PaginationFooter from "../../../../../_components/PaginationFooter";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

const ProductCards = ({
  products,
  onEdit,
  onDelete,
  currentPage,
  totalDocs,
  itemsPerPage,
  onPageChange,
}) => {
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "price") {
      aValue = a.prices?.price;
      bValue = b.prices?.price;
    } else if (sortField === "stock") {
      aValue = a.stock;
      bValue = b.stock;
    } else if (sortField === "category") {
      aValue = a.category?.name;
      bValue = b.category?.name;
    }

    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <Card
              key={product._id}
              className="hover:shadow-md transition-shadow p-0"
            >
              <CardContent className="p-0">
                <div className="flex flex-col ">
                  <div className="relative aspect-square mb-4 h-[240px]">
                    {product?.image?.[0] ? (
                      <Image
                        src={product.image[0]}
                        alt={product.title}
                        height={200}
                        width={200}
                        className="w-full h-[240px] object-cover rounded-t-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-grow p-4">
                    <h3 className="font-medium line-clamp-2 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.category?.name || "Uncategorized"}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold">
                          ${product?.price?.toFixed(2) || "0.00"}
                        </span>
                        {product?.salePrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ${product.salePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={product.stock > 0 ? "default" : "destructive"}
                        className="bg-[#FDF5E5] text-[#222222]"
                      >
                        {product.stock > 0 ? "In stock" : "Out of stock"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Stock: {product.stock || 0}</span>
                      <div className="flex items-center gap-2">
                        <span>Published:</span>
                        <Switch checked={product.status || false} disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => onDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalDocs > itemsPerPage && (
        <div className="mt-6">
          <PaginationFooter
            totalItems={totalDocs}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCards;
