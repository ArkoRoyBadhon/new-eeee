"use client";
import { useEffect, useState } from "react";
// import { products } from "@/mocks/ProductData";
import { ProductCard } from "../(main)/products/_components/ProductCard";
import { productApi } from "@/lib/api";

const ProductRecomendation = () => {
  const [currentPage] = useState(1);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage || 1,
        }).toString();

        const response = await productApi.getProductsAll(params);
        const { products: fetchedproducts, ...rest } = response;
        setProducts(fetchedproducts);
        // setProductStats(rest);
        // setIsLoading(false);
      } catch (error) {
        // setIsLoading(false);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, []);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.slice(0, 5).map((product) => (
        <ProductCard product={product} />
      ))}
    </div>
  );
};

export default ProductRecomendation;
