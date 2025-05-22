import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "next-themes";

const TableLoading = ({ row = 5, col = 4, width = 200, height = 25 }) => {
  const newArray = Array.from({ length: row }, (_, i) => i + 1);

  return (
    <div className="rounded-md border mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: col }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton
                  className={`h-10 w-[${width}px]`}
                  style={{ width: `${width}px` }}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {newArray.map((item) => (
            <TableRow key={item}>
              {Array.from({ length: col }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton
                    className={`h-[${height}px] w-[${width}px]`}
                    style={{ height: `${height}px`, width: `${width}px` }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={col} className="flex justify-between">
              <Skeleton className="h-6 w-[290px]" />
              <Skeleton className="h-6 w-[290px]" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TableLoading;
