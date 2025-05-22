"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { reviewApi } from "@/lib/api";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const CompletedComponent = ({ id, order }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [refecthReviews, setRefecthReviews] = useState(false);

  const { user, token } = useSelector((state) => state.auth);

  const handleSubmitReview = async () => {
    setIsSubmittingReview(true);
    try {
      if (!reviewText) {
        toast.warning("Please write your review before submitting");
        return;
      }

      const reviewData = {
        rating,
        comment: reviewText,
        user: user?._id,
        order: order?._id,
        product: order?.product?._id,
      };

      const response = await reviewApi.createReview(reviewData, token);
      setReviews([response.data, ...reviews]);
      toast.success("Review submitted successfully!");
      setRefecthReviews(true);
      setRating(0);
      setReviewText("");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await reviewApi.getReviewsByOrder(order?._id);
        setReviews(response || []);
      } catch (error) {
        toast.error("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
        setRefecthReviews(false);
      }
    };
    fetchReviews();
  }, [order?._id, refecthReviews]);

  const allReviews = [
    ...(order.review ? [order.review] : []),
    ...reviews.filter((review) => review?._id !== order.review?._id),
  ];

  return (
    <Card className="bg-[#FDF5E5] border-none shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="text-[#555555] font-medium text-lg">
                Your order has been delivered!
              </h3>
              <p className="text-sm text-[#555555]">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {order.buyerConfirmed && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Confirmed on {new Date(order.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-[#555555] font-bold pb-2">How was your order?</h4>

          {loadingReviews ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : allReviews.length > 0 ? (
            <div className="space-y-4">
              {allReviews.map((review) => (
                <div
                  key={review?._id}
                  className="bg-white p-4 rounded-lg border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {review?._id === order.review?._id
                          ? "You"
                          : `${review.user?.firstName || "Anonymous"} ${
                              review.user?.lastName || ""
                            }`}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(
                        review.createdAt || order.deliveredAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                  {review?._id === order.review?._id && (
                    <p className="text-xs text-gray-500 mt-1">(Order review)</p>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {!order.review && (
            <>
              <div className="mt-4 flex items-center gap-1">
                {user?.role === "buyer" &&
                  [1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
              </div>
              <Textarea
                placeholder="Share your experience with this order..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[100px] mt-2"
              />
              <Button
                onClick={handleSubmitReview}
                className="bg-[#001C44] hover:bg-[#001C44]/90 mt-2"
                disabled={
                  !reviewText ||
                  (user?.role !== "seller" && rating === 0) ||
                  isSubmittingReview
                }
              >
                {isSubmittingReview ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Submit Review
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletedComponent;
