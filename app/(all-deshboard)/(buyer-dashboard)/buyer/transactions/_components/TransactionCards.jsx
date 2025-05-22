import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const statusVariantMap = {
  completed: "success",
  pending: "warning",
  failed: "destructive",
};

export function TransactionCard({ transaction }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={transaction.avatarUrl} />
            <AvatarFallback>
              {transaction.merchant.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{transaction.merchant}</p>
            <p className="text-xs text-muted-foreground">
              {format(transaction.date, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <Badge variant={statusVariantMap[transaction.status]}>
          {transaction.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              {transaction.category}
            </p>
            <p className="text-sm line-clamp-1">{transaction.description}</p>
          </div>
          <p
            className={`text-lg font-semibold ${
              transaction.amount > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.amount > 0 ? "+" : ""}
            {transaction.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Details
        </Button>
        <Button variant="outline" size="sm">
          Dispute
        </Button>
      </CardFooter>
    </Card>
  );
}
