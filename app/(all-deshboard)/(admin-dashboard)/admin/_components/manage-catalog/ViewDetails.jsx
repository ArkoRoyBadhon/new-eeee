import React from "react";

const ViewDetails = ({ catalog }) => {
  return (
    <div className="space-y-4">
      <p>
        <strong>Catalog Name:</strong> {catalog?.catalogName || "N/A"}
      </p>
      <p>
        <strong>Categories:</strong>{" "}
        {Array.isArray(catalog?.categories) && catalog.categories.length > 0
          ? catalog.categories.join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Sub-Categories:</strong>{" "}
        {Array.isArray(catalog?.subCategories) && catalog.subCategories.length > 0
          ? catalog.subCategories.join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Status:</strong> <span className="capitalize">{catalog?.status || "N/A"}</span>
      </p>
      <p>
        <strong>Upload Date:</strong>{" "}
        {catalog?.createdAt
          ? new Date(catalog.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
      <p>
        <strong>Seller Email:</strong> {catalog?.sellerId?.email || "N/A"}
      </p>
      {catalog?.image && (
        <p>
          <strong>Image:</strong>{" "}
          <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${catalog.image}`} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </p>
      )}
    </div>
  );
};

export default ViewDetails;