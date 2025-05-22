import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const ProductDetails = ({ product }) => {
  return (
    <Card className="bg-[#f5f5f4] border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Product details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 mb-6">
          <div className="relative w-16 h-16 bg-white rounded overflow-hidden">
            <Image
              src={product?.image[0] || "/placeholder.svg"}
              alt={product?.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{product?.title}</p>
            <p className="text-sm text-gray-500">
              Model: {product?.modelNumber}
            </p>
          </div>
        </div>
        <h3 className="text-center font-medium">Specification</h3>
        <Separator className="my-4 p-[1px]" />
        <div className="mt-4 space-y-2">
          {product?.keyAttributes &&
            Object.entries(product?.keyAttributes)?.map(
              ([key, value], index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 bg-gray-100 rounded"
                >
                  <span className="font-medium">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              )
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
