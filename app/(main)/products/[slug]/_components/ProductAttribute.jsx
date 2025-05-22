import React from "react";

const ProductAttribute = ({ attributes }) => {
  if (!attributes || typeof attributes !== "object") {
    return <p className="text-gray-600">No attributes available.</p>;
  }

  console.log(attributes);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Key Attributes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(attributes).map(([key, value], index) => (
          <div
            key={index}
            className="flex justify-between p-3 bg-gray-100 rounded"
          >
            <span className="font-medium">{key}</span>
            <span className="text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAttribute;
