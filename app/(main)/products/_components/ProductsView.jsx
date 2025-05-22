"use client";
import { ProductCard } from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterOptions from "./FilterOptions";
import { useEffect, useState } from "react";
import { productApi } from "@/lib/api";
import PaginationFooter from "@/app/_components/PaginationFooter";
import PartnerSection from "../../_components/homePage/PartnerSection";
import SupplierComponent from "./SupplierComponent";
import { LongProductCard } from "./LongProductCard";

const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [activeCategory, setActiveCategory] = useState(null);
  // filter option - minPrice, maxPrice, minOrder, country, review
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minOrder: null,
    country: null,
    rating: null,
    merge: false, // merge with supplier
    paidSample: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams({
          category: activeCategory || "",
          minPrice: filters.minPrice || "",
          maxPrice: filters.maxPrice || "",
          minOrder: filters.minOrder || "",
          country: filters.country || "",
          paidSample: filters.paidSample,
          rating: filters.rating || "",
          merge: filters.merge, // merge with supplier
          page: currentPage || 1,
        }).toString();

        const response = await productApi.getProductsAll(params);
        const { products: fetchedproducts, ...rest } = response;
        setProducts(fetchedproducts);
        setProductStats(rest);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentPage, activeCategory, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  console.log("filter", filters);

  return (
    // <div className="customContainer p-4 lg:p-0">
    <div className="">
      <div className="container mx-auto px-5 md:px-10 lg:px-20 2xl:px-8 my-[32px]">
        <div className="w-full flex flex-col md:flex-row gap-[16px]">
          <div className="">
            <FilterOptions
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          {/* <div className="max-w-[918px] rounded-[16px]"> */}
          <div className="w-full rounded-[16px]">
            <Tabs defaultValue="products" className="mb-6">
              <TabsList className="w-full lg:w-[480px] bg-transparent grid grid-cols-3">
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-[#DFB547] data-[state=active]:text-white h-[40px] px-[40px] py-[4px] rounded-[55px] font-bold text-[15px] leading-[150%] tracking-[-1%]"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="buying-leads"
                  className="data-[state=active]:bg-[#DFB547] data-[state=active]:text-white h-[40px] px-[40px] py-[4px] rounded-[55px] data-[state=active]:font-bold text-[15px] leading-[150%] tracking-[-1%]"
                >
                  Buying Leads
                </TabsTrigger>
                <TabsTrigger
                  value="companies"
                  className="data-[state=active]:bg-[#DFB547] data-[state=active]:text-white h-[40px] px-[40px] py-[4px] rounded-[55px] data-[state=active]:font-bold text-[15px] leading-[150%] tracking-[-1%]"
                >
                  Suppliers
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="products"
                className="p-2 md:p-[24px] border custom-shadow rounded-[16px] mt-[16px]  min-h-[calc(100vh-240px)]"
              >
                <div className="mb-4">
                  <h2 className="text-[20px] leading-[120%] tracking-[-1%] font-bold">
                    Products Found ({products.length})
                  </h2>
                </div>

                {/* <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"> */}
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    // <ProductCard key={product?._id} product={product} />
                    <LongProductCard key={product?._id} product={product} />
                  ))}
                </div>
                {productStats?.total && (
                  <div className="mt-6">
                    <PaginationFooter
                      totalItems={productStats?.total}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="buying-leads"
                className="p-2 md:p-[24px] border custom-shadow rounded-[16px] mt-[16px]  min-h-[calc(100vh-240px)]"
              >
                <div className="flex items-center justify-center h-40">
                  <p className="text-[#555555]">Buying leads upcoming...</p>
                </div>
              </TabsContent>

              <TabsContent
                value="companies"
                className="p-2 md:p-[24px] border custom-shadow rounded-[16px] mt-[16px]  min-h-[calc(100vh-240px)]"
              >
                <SupplierComponent />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <PartnerSection />
    </div>
  );
};

export default ProductsView;
