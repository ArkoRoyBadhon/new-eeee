import React from "react";
import ProductDetail from "./_components/ProductDetail";

const page = async ({ params }) => {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
};

export default page;


