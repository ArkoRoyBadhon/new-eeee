"use client";
import { Card, CardContent } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import React, { useEffect, useState } from "react";

const SupplierInfo = ({ product }) => {
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await authApi.getSupplierInfo(product?.seller?._id);
        setSupplier(response);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Supplier Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p className="font-medium">Supplier Name</p>
            <p className="text-gray-600">
              {supplier?.firstName} {supplier?.lastName}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="font-medium">Company</p>
            <p className="text-gray-600">{supplier?.companyName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="font-medium">Supplier Rating</p>
            <p className="text-gray-600">4.5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="font-medium">Response Rate</p>
            <p className="text-gray-600">
              100%
              {/* {product?.supplier?.responseRate || "Not available"} */}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="font-medium">Response Time</p>
            <p className="text-gray-600">Twice a day</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierInfo;
