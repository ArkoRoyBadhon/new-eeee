import { DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SummaryCard = ({ order }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Cost breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>$2,500.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Escrow Fee</span>
              <span>$75.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>$2,575.00</span>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="rounded-md bg-gray-50 p-4">
            <h4 className="text-sm font-medium">Payment Terms</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
              <li>
                {order?.paymentTerms?.upfront}% upfront payment:{" "}
                <span className="font-medium">$772.50</span>
              </li>
              <li>
                {order?.paymentTerms?.onDelivery}% on delivery:{" "}
                <span className="font-medium">$1,802.50</span>
              </li>
            </ul>
          </div>

          {/* Escrow protection */}
          <div className="mt-6">
            <div className="rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-medium">Escrow Protection</h4>
                  <p className="text-xs text-gray-600">
                    Your payment is held securely until you approve the delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="mt-4">
            <div className="rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-medium">Money-Back Guarantee</h4>
                  <p className="text-xs text-gray-600">
                    Full refund if you're not satisfied with the delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
