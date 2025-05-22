"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
// import AddProductForm from "./AddProductForm";
import EditProductModal from "./EditProductModal";
import ProductTable from "./ProductTable";
import { categoryApi, productApi } from "@/lib/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import PageTitle from "@/app/_components/Typography/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import TableLoading from "@/app/_components/TableLoader";

const ManageProductView = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const [allCategory, setAllCategory] = useState([]);
  const [formData, setFormData] = useState({ category: "", search: "" });
  const [sortedField, setSortedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const router = useRouter();

  const fetchFilteredProducts = async (params = new URLSearchParams()) => {
    setLoading(true);
    setError(null);

    try {
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

      const queryString = params.toString();

      const urlParams = new URLSearchParams(params);
      urlParams.delete("page");
      urlParams.delete("limit");
      router.push(`?${urlParams.toString()}`, { scroll: false });

      const response = await productApi.getStoreProducts(token, queryString);
      setProducts(response?.products);
      setTotalDocs(response?.pagination?.totalProducts || 0);
      setItemsPerPage(response?.pagination?.totalProducts || 20);

      setTotalDocs(3);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = () => {
    fetchFilteredProducts();
  };

  const HandleFilter = async (e) => {
    e?.preventDefault();

    const params = new URLSearchParams();
    if (formData.search) params.append("title", formData.search);
    if (formData.category) params.append("category", formData.category);
    if (sortedField) params.append("price", sortedField);

    if (e) {
      setCurrentPage(1);
    }

    await fetchFilteredProducts(params);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    HandleFilter();
  }, [currentPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const initialFilters = {
        search: searchParams.get("title") || "",
        category: searchParams.get("category") || "",
      };
      const initialSort = searchParams.get("price") || "";

      setFormData(initialFilters);
      setSortedField(initialSort);

      HandleFilter();
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setAllCategory(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    // Fetch categories
    fetchCategories();
  }, []);

  const handleResetField = () => {
    setFormData({ search: "", category: "" });
    setSortedField("");
    setCurrentPage(1);
    router.push("", { scroll: false });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditingProduct(true);
  };

  const handleDelete = async (id) => {
    const toastid = toast.loading("Deleting product...");
    try {
      await productApi.deleteProduct(token, id);
      setProducts(products.filter((product) => product._id !== id));
      toast.success("Product deleted successfully", { id: toastid });
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      toast.error("Failed to delete product. Please try again.", {
        id: toastid,
      });
    } finally {
      toast.dismiss(toastid);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-[80vh]">
      <div className="flex justify-between items-center mb-2">
        <PageTitle>Product Management</PageTitle>
        {/* <Button onClick={() => setIsAddingProduct(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button> */}
      </div>

      <div className="w-full">
        <Card className="overflow-hidden bg-white rounded-lg mb-4 border-none shadow-none p-0">
          <CardContent>
            <form
              onSubmit={HandleFilter}
              className="py-3 grid gap-4 lg:gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              <div>
                <Input
                  type="search"
                  name="search"
                  placeholder="Search Product"
                  value={formData.search}
                  onChange={(e) =>
                    setFormData({ ...formData, search: e.target.value })
                  }
                />
              </div>

              <div>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategory.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Select
                  className="w-full"
                  onValueChange={(value) => setSortedField(value)}
                  value={sortedField}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low to High</SelectItem>
                    <SelectItem value="high">High to Low</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="unPublished">Unpublished</SelectItem>
                    <SelectItem value="status-selling">
                      Status Selling
                    </SelectItem>
                    <SelectItem value="status-out-of-stock">
                      Out of Stock
                    </SelectItem>
                    <SelectItem value="date-added-asc">
                      Date Added Ascending
                    </SelectItem>
                    <SelectItem value="date-added-desc">
                      Date Added Descending
                    </SelectItem>
                    <SelectItem value="date-updated-asc">
                      Date Updated Ascending
                    </SelectItem>
                    <SelectItem value="date-updated-desc">
                      Date Updated Descending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  className="px-12 bg-[#DFB547]"
                  disabled={loading}
                >
                  {loading ? "Filtering..." : "Filter"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetField}
                  type="button"
                  className="px-12 dark:bg-gray-700"
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="block lg:hidden">
            <TableLoading col={2} />
          </div>
          <div className="hidden lg:block">
            <TableLoading col={3} />
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 py-4 text-center">{error}</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalDocs={totalDocs}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* {isAddingProduct && (
        <AddProductForm
          open={isAddingProduct}
          onClose={() => setIsAddingProduct(false)}
          onSuccess={() => {
            setIsAddingProduct(false);
          }}
        />
      )} */}

      {isEditingProduct && (
        <EditProductModal
          open={isEditingProduct}
          product={currentProduct}
          onClose={() => {
            setIsEditingProduct(false);
            setCurrentProduct(null);
          }}
          onSuccess={() => {
            setCurrentProduct(null);
            onSuccess();
          }}
        />
      )}
    </div>
  );
};

export default ManageProductView;
