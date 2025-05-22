"use client";
import PaginationFooter from "@/app/_components/PaginationFooter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { transactionApi } from "@/lib/api";
import { Calendar, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TransactionHistory = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    const fetchBuyerTransactions = async () => {
      try {
        if (token) {
          setIsLoading(true);
          const buyerTransactions = await transactionApi.getTransaction(
            user?._id,
            token
          );

          const { transactions: transactiondata, ...rest } = buyerTransactions;
          setTransactions(transactiondata || []);
          setTransactionStats(rest);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchBuyerTransactions();
  }, [token]);

  return (
    <div className="w-full p-6">
      <div className=" p-6 min-h-[60vh] rounded-[16px] custom-shadow">
        {/* <h1 className="mb-4 text-lg font-bold">Order Transactions</h1> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 custom-shadow bg-[#001C44]">
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-sm text-white font-semibold">
                  Daily <span>({transactionStats?.summary?.daily?.count})</span>
                </p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {transactionStats?.summary?.daily?.totalAmount || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 custom-shadow bg-[#001C44]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">
                  Weekly{" "}
                  <span>({transactionStats?.summary?.weekly?.count})</span>
                </p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {transactionStats?.summary?.weekly?.totalAmount || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 custom-shadow bg-[#001C44]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">
                  Monthly{" "}
                  <span>({transactionStats?.summary?.monthly?.count})</span>
                </p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {transactionStats?.summary?.monthly?.totalAmount || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p>Loading your transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center text-[#555555] text-[20px] leading-[150%] tracking-[-1%] font-bold min-h-[300px]">
            You haven't made any orders yet
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-between min-h-[60vh]">
              <div className="grid grid-cols-1 gap- p-4">
                {transactions.length > 0 &&
                  [{ title: "hello" }, ...transactions]?.map((transaction) => (
                    <Card
                      key={transaction?._id}
                      className="shadow-none rounded-none px-4  overflow-hidden"
                    >
                      <div className="flex w-full items-center">
                        {transaction?.title ? (
                          <div className="flex-1 font-bold">
                            Latest Transactions
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              {new Date(
                                transaction?.createdAt
                              ).toLocaleDateString()}
                              <div className="flex items-center gap-1 text-[12px] text-[#555555]">
                                <Clock className="h-[12px] w-[12px]" />
                                {new Date(
                                  transaction?.createdAt
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                            <div className="flex-1 font-semibold">
                              {transaction?.paymentMethod}
                            </div>
                            <div className="flex-2">
                              Ref:{" "}
                              <span className="font-semibold">
                                {transaction?.reference}
                              </span>
                            </div>
                            <div className="flex-1 font-semibold">
                              {transaction?.currency}
                            </div>
                            <div className="flex-1 font-semibold">
                              ${transaction?.amount}
                            </div>
                            <div className="flex-1">
                              <Badge className="bg-[#FDF5E5] text-[#222222]">
                                {transaction?.status}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>

              {transactionStats?.total && (
                <div className="mt-6">
                  <PaginationFooter
                    totalItems={transactionStats?.total}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
