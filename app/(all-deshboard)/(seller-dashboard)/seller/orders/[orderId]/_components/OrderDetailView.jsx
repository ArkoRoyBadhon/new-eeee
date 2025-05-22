// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useEffect, useState } from "react";
// import ProductDetails from "./ProductDetails";
// import { orderApi } from "@/lib/api";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";
// import InquiryCard from "@/app/_components/InquiryCard";
// import PaymentDetail from "@/app/_components/order/PaymentDetail";
// import SummaryCard from "@/app/_components/order/SummaryCard";
// import {
//   AlertCircle,
//   CheckCircle2,
//   CircleDollarSign,
//   DollarSign,
//   FileText,
//   Loader2,
//   MessageSquare,
//   RefreshCw,
//   Star,
//   Truck,
//   Upload,
//   X,
// } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import BuyerShipped from "@/app/_components/order/BuyerShipped";
// import SellerShipped from "@/app/_components/order/SellerShipped";
// import OrderProgressTracker from "@/app/_components/order/OrderProgressTracker";
// import SellerProcessing from "@/app/_components/order/SellerProcessing";
// // import ManagePayment from "@/app/(all-deshboard)/(buyer-dashboard)/buyer/payment/_components/ManagePayment";
// // import SellerShipped from "./SellerShipped";
// // import BuyerShipped from "./BuyerShipped";

// const OrderDetailView = ({ id }) => {
//   const [orderStatus, setOrderStatus] = useState("Not_Confirm");
//   const [order, setOrder] = useState({});

//   const { token, user } = useSelector((state) => state.auth);

//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [rating, setRating] = useState(5);
//   const [reviewText, setReviewText] = useState("");
//   const [isSubmittingReview, setIsSubmittingReview] = useState(false);
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [showRefundModal, setShowRefundModal] = useState(false);
//   const [showContactModal, setShowContactModal] = useState(false);

//   const [isConfirming, setIsConfirming] = useState(false);

//   const handleConfirmOrder = async () => {
//     setIsConfirming(true);

//     try {
//       orderProcess("Completed");
//       toast.success("Order confirmed successfully!");
//     } catch (error) {
//       toast.error("Failed to confirm order");
//       console.error(error);
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   const handleSubmitReview = async () => {
//     if (!reviewText) {
//       toast.warning("Please write your review before submitting");
//       return;
//     }

//     setIsSubmittingReview(true);

//     try {
//       const response = await fetch(`/api/orders/${order._id}/review`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           rating,
//           comment: reviewText,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit review");

//       const data = await response.json();
//       // Update order in state with new review
//       toast.success("Thank you for your review!");
//     } catch (error) {
//       toast.error("Failed to submit review");
//       console.error(error);
//     } finally {
//       setIsSubmittingReview(false);
//     }
//   };

//   const handleFileUpload = (e) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setUploadedFiles((prev) => [...prev, ...newFiles]);
//     }
//   };

//   const removeFile = (index) => {
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleDispatch = async () => {
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("status", "Dispatched");
//       // formData.append("trackingNumber", trackingNumber);

//       uploadedFiles.forEach((file) => {
//         formData.append("dispatchDocuments", file);
//       });
//       orderProcess("Shipped");
//       toast.success("Order dispatched successfully!");
//     } catch (error) {
//       toast.error("Failed to dispatch order");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const orderProcess = async (order_status) => {
//     try {
//       if (order_status === "Confirm") {
//         const response = await orderApi.updateOrder(
//           id,
//           { status: "Pending" },
//           token
//         );
//         toast.success("Order confirmed successfully!");
//         setOrderStatus(response.status);
//       } else if (order_status === "Cancel") {
//         const response = await orderApi.updateOrder(
//           id,
//           { status: "Cancelled" },
//           token
//         );
//         toast.success("Order cancelled successfully!");
//         setOrderStatus(response.status);
//       } else if (order_status === "Shipped") {
//         const response = await orderApi.updateOrder(
//           id,
//           { status: "Shipped" },
//           token
//         );
//         setOrderStatus(response.status);
//       } else if (order_status === "Delivered") {
//         const response = await orderApi.updateOrder(
//           id,
//           { status: "Delivered" },
//           token
//         );
//         setOrderStatus(response.status);
//       } else if (order_status === "Completed") {
//         const response = await orderApi.updateOrder(
//           id,
//           { status: "Completed" },
//           token
//         );
//         setOrderStatus(response.status);
//       }
//       // setOrderStatus("Pending");
//     } catch (error) {
//       toast.error("Failed to confirm order. Please try again.");
//     }
//   };

//   const getActiveStep = () => {
//     switch (orderStatus) {
//       case "Not_Confirm":
//         return 0;
//       case "Pending":
//         return 1;
//       case "Processing":
//         return 2;
//       case "Shipped":
//         return 3;
//       case "Delivered":
//         return 4;
//       case "Completed":
//         return 5;
//       default:
//         return 0;
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         if (!token) return;
//         const response = await orderApi.getOrderbyId(id, token);
//         setOrderStatus(response?.status);
//         setOrder(response);
//         console.log(response);
//       } catch (error) {}
//     })();
//   }, [token, orderStatus]);

//   console.log(order);

//   return (
//     // <div className="max-w-[791px] mx-auto py-8 px-4">
//     <div className="max-w-full mx-auto py-8 px-4 overflow-hidden">
//       <Card className="custom-shadow">
//         <CardHeader className="pb-4">
//           <CardTitle>Order details</CardTitle>
//           <p className="text-sm text-gray-500">
//             <strong>Order number: </strong>
//             {order?._id} <strong>Order Date:</strong>{" "}
//             {new Date(order.createdAt).toDateString()}
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <OrderProgressTracker activeStep={getActiveStep()} />

//           {user.role === "seller" && orderStatus === "Not_Confirm" && (
//             <Card className="bg-[#FDF5E5] border-none">
//               <CardContent className="p-6">
//                 <h3 className="font-medium mb-2">
//                   Waiting for buyer to confirm order
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   The order will be paid via Payment Terms. You need to confirm
//                   the order, then pay the initial payment, and then pay the
//                   remaining balance within 30 days after the order is shipped.
//                 </p>
//                 <div className="flex flex-wrap gap-3">
//                   <Button
//                     variant="outline"
//                     onClick={() => orderProcess("Confirm")}
//                     className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
//                   >
//                     Confirm order
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
//                   >
//                     Request modification
//                   </Button>
//                   <Button
//                     onClick={() => orderProcess("Cancel")}
//                     variant="outline"
//                     className="bg-white hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
//                   >
//                     Cancel order
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {user?.role === "buyer" && orderStatus === "Not_Confirm" && (
//             <Card className="bg-[#FDF5E5] border-none shadow-none">
//               <CardContent className="p-6">
//                 <div className="w-full flex gap-4">
//                   <h3 className="text-[#555555]">
//                     Please Wait for Supplier to confirm
//                   </h3>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {orderStatus === "Cancelled" && (
//             <Card className="bg-[#FDF5E5] border-none">
//               <CardContent className="p-6">
//                 <h3 className="font-medium mb-2">Buyer Cancelled order</h3>
//               </CardContent>
//             </Card>
//           )}

//           {user?.role === "buyer" &&
//             orderStatus === "Processing" &&
//             orderStatus === "Shipped" &&
//             orderStatus === "Delivered" && (
//               <Card className="bg-[#FDF5E5] border-none">
//                 <CardContent className="p-6">
//                   <h3 className="font-medium mb-2">
//                     Waiting for supplier to ship
//                   </h3>
//                   <div className="mb-4">
//                     <Input
//                       placeholder="There was a delay in dispatch. New dispatch time:"
//                       className="bg-white"
//                     />
//                   </div>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Please check your order&apos;s product quality within 60
//                     days after receive the goods. If there are product quality
//                     issues or the supplier does not ship on time, you can apply
//                     for refund on
//                   </p>
//                   <Button
//                     variant="outline"
//                     className="hover:bg-[#DFB547] rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px] custom-text"
//                   >
//                     Apply for refund
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}

//           {user?.role === "seller" &&
//             orderStatus === "Pending" &&
//             !order.isVerified &&
//             order.payStatus !== "Upfront" && (
//               <Card className="bg-[#FDF5E5] border-none">
//                 <CardContent className="p-6">
//                   <h3 className="font-medium mb-2 text-[#555555]">
//                     Waiting for 30% upfront payment
//                   </h3>
//                   <p className="text-[12px] leading-[150%] tracking-[-1%] text-[#555555]">
//                     **Buyer pay 30% of total Cost as deposit. Rest will be paid
//                     on delivery**
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//           {user?.role === "buyer" && orderStatus === "Pending" && (
//             <Card className="bg-[#FDF5E5 border-none shadow-none">
//               <CardContent className="p-0">
//                 {/* <CardContent className="p-6"> */}
//                 <ManagePayment id={id} setOrderStatus={setOrderStatus} />
//               </CardContent>
//             </Card>
//           )}

//           {user?.role === "buyer" &&
//             orderStatus === "Processing" &&
//             order.isVerified &&
//             order.payStatus === "Upfront" && (
//               <Card className="bg-[#FDF5E5] border-none shadow-none">
//                 <CardContent className="p-6">
//                   <div className="w-full flex flex-col gap-4">
//                     <div className="flex items-center gap-3">
//                       <CircleDollarSign className="h-5 w-5 text-blue-500" />
//                       <div>
//                         <h3 className="text-[#555555] font-medium">
//                           Payment Received (30%)
//                         </h3>
//                         <p className="text-sm text-[#555555] mt-1">
//                           Thank you for your partial payment! Your order is now
//                           being processed.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-[#555555]">Payment Progress</span>
//                         <span className="font-medium">30% completed</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className="bg-[#DFB547] h-2.5 rounded-full"
//                           style={{ width: "30%" }}
//                         ></div>
//                       </div>
//                     </div>

//                     <div className="text-sm text-[#555555]">
//                       <p>
//                         Remaining balance:{" "}
//                         <span className="font-medium">
//                           ${(order.total * 0.7).toFixed(2)}
//                         </span>
//                       </p>
//                       <p className="mt-1">
//                         Next payment due:{" "}
//                         {new Date(order.dueDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//           {user?.role === "seller" && orderStatus === "Processing" && (
//             <SellerProcessing
//               id={id}
//               order={order}
//               setOrderStatus={setOrderStatus}
//             />
//           )}

//           {user?.role === "buyer" && orderStatus === "Shipped" && (
//             <BuyerShipped id={id} order={order} />
//           )}

//           {user?.role === "seller" && orderStatus === "Shipped" && (
//             <SellerShipped
//               id={id}
//               order={order}
//               setOrderStatus={setOrderStatus}
//             />
//           )}

//           {user?.role === "seller" && orderStatus === "Delivered" && (
//             <Card className="bg-[#FDF5E5] border-none shadow-none">
//               <CardContent className="p-6">
//                 <div className="w-full flex flex-col gap-6">
//                   {/* Delivery confirmation header */}
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       <CheckCircle2 className="h-6 w-6 text-green-500" />
//                       <div>
//                         <h3 className="text-[#555555] font-medium text-lg">
//                           Order has been delivered!
//                         </h3>
//                         <p className="text-sm text-[#555555]">
//                           Delivered on{" "}
//                           {new Date(order.deliveredAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     {order.buyerConfirmed && (
//                       <div className="flex items-center text-sm text-green-600">
//                         <CheckCircle2 className="h-4 w-4 mr-1" />
//                         Confirmed on{" "}
//                         {new Date(order.buyerConfirmedAt).toLocaleDateString()}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//           {user?.role === "buyer" && orderStatus === "Delivered" && (
//             <Card className="bg-[#FDF5E5] border-none shadow-none">
//               <CardContent className="p-6">
//                 <div className="w-full flex flex-col gap-6">
//                   {/* Delivery confirmation header */}
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       <CheckCircle2 className="h-6 w-6 text-green-500" />
//                       <div>
//                         <h3 className="text-[#555555] font-medium text-lg">
//                           Your order has been delivered!
//                         </h3>
//                         <p className="text-sm text-[#555555]">
//                           Delivered on{" "}
//                           {new Date(order.deliveredAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     {!order.buyerConfirmed && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-green-500 text-green-600 hover:bg-green-50"
//                         onClick={handleConfirmOrder}
//                         disabled={isConfirming}
//                       >
//                         {isConfirming ? (
//                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         ) : (
//                           <CheckCircle2 className="h-4 w-4 mr-2" />
//                         )}
//                         Confirm Receipt
//                       </Button>
//                     )}

//                     {orderStatus === "Completed" && (
//                       <div className="flex items-center text-sm text-green-600">
//                         <CheckCircle2 className="h-4 w-4 mr-1" />
//                         <p className="">Thank you For Confirmation</p>
//                       </div>
//                     )}
//                     {order.buyerConfirmed && (
//                       <div className="flex items-center text-sm text-green-600">
//                         <CheckCircle2 className="h-4 w-4 mr-1" />
//                         Confirmed on{" "}
//                         {new Date(order.buyerConfirmedAt).toLocaleDateString()}
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-sm text-[#555555]">
//                     **If you are not confirm, then the order will be confirmed
//                     automatically after 7 days**
//                   </p>
//                   {order.trackingNumber && (
//                     <div className="space-y-2">
//                       <p className="text-sm font-medium text-[#555555]">
//                         Tracking information
//                       </p>
//                       <div className="flex items-center gap-2">
//                         <Input
//                           value={order.trackingNumber}
//                           readOnly
//                           className="bg-gray-50"
//                         />
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             navigator.clipboard.writeText(order.trackingNumber);
//                             toast.success("Tracking number copied!");
//                           }}
//                         >
//                           <Copy className="h-4 w-4 mr-1" />
//                           Copy
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             window.open(
//                               `https://trackingservice.com/?track=${order.trackingNumber}`,
//                               "_blank"
//                             )
//                           }
//                         >
//                           <ExternalLink className="h-4 w-4 mr-1" />
//                           Track
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                   {/* Return/refund options */}
//                   <div className="space-y-3">
//                     <h4 className="text-[#555555] font-medium">
//                       Need help with your order?
//                     </h4>
//                     <div className="flex flex-wrap gap-3">
//                       <Button
//                         variant="outline"
//                         onClick={() => setShowReturnModal(true)}
//                         disabled={order.returnRequested}
//                       >
//                         {order.returnRequested ? (
//                           <>
//                             <CheckCircle2 className="h-4 w-4 mr-2" />
//                             Return Requested
//                           </>
//                         ) : (
//                           <>
//                             <RefreshCw className="h-4 w-4 mr-2" />
//                             Request Return
//                           </>
//                         )}
//                       </Button>
//                       {/* <Button
//                         variant="outline"
//                         onClick={() => setShowRefundModal(true)}
//                         disabled={order.refundRequested}
//                       >
//                         {order.refundRequested ? (
//                           <>
//                             <CheckCircle2 className="h-4 w-4 mr-2" />
//                             Refund Requested
//                           </>
//                         ) : (
//                           <>
//                             <DollarSign className="h-4 w-4 mr-2" />
//                             Request Refund
//                           </>
//                         )}
//                       </Button> */}
//                       <Button
//                         variant="outline"
//                         onClick={() => setShowContactModal(true)}
//                       >
//                         <MessageSquare className="h-4 w-4 mr-2" />
//                         Contact Seller
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {orderStatus === "Completed" && (
//             <Card className="bg-[#FDF5E5] border-none shadow-none">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-3">
//                     <CheckCircle2 className="h-6 w-6 text-green-500" />
//                     <div>
//                       <h3 className="text-[#555555] font-medium text-lg">
//                         Your order has been delivered!
//                       </h3>
//                       <p className="text-sm text-[#555555]">
//                         Delivered on{" "}
//                         {new Date(order.deliveredAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   {order.buyerConfirmed && (
//                     <div className="flex items-center text-sm text-green-600">
//                       <CheckCircle2 className="h-4 w-4 mr-1" />
//                       Confirmed on{" "}
//                       {new Date(order.buyerConfirmedAt).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Review and feedback section */}
//                 <div className="mt-4">
//                   <h4 className="text-[#555555] font-medium">
//                     How was your order?
//                   </h4>

//                   {order.review ? (
//                     <div className="bg-white p-4 rounded-lg border">
//                       <p className="font-medium">Your review:</p>
//                       <div className="flex items-center gap-1 mt-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${
//                               i < order.review.rating
//                                 ? "text-yellow-500 fill-yellow-500"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <p className="mt-2 text-sm">{order.review.comment}</p>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <button
//                             key={star}
//                             onClick={() => setRating(star)}
//                             className="focus:outline-none"
//                           >
//                             <Star
//                               className={`h-6 w-6 ${
//                                 Star <= rating
//                                   ? "text-yellow-500 fill-yellow-500"
//                                   : "text-gray-300"
//                               }`}
//                             />
//                           </button>
//                         ))}
//                       </div>
//                       <Textarea
//                         placeholder="Share your experience with this order..."
//                         value={reviewText}
//                         onChange={(e) => setReviewText(e.target.value)}
//                         className="min-h-[100px]"
//                       />
//                       <Button
//                         onClick={handleSubmitReview}
//                         className="bg-[#001C44] hover:bg-[#001C44]/90"
//                         disabled={isSubmittingReview}
//                       >
//                         {isSubmittingReview ? (
//                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         ) : null}
//                         Submit Review
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           <div className="w-fit">
//             <InquiryCard title="Product Details" singleConversation={order} />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OrderDetailView;
