"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { reviewApi } from "@/lib/api";

const ProductReviewSection = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const renderStars = (rating, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, index) => {
        const starNumber = index + 1;
        const isFilled = interactive
          ? starNumber <= (hoveredRating || newReview.rating)
          : starNumber <= rating;

        return (
          <Star
            key={index}
            className={`w-5 h-5 ${
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onMouseEnter={
              interactive ? () => setHoveredRating(starNumber) : undefined
            }
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
            onClick={
              interactive ? () => handleRatingClick(starNumber) : undefined
            }
          />
        );
      });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await reviewApi.getReviews(product?._id);
        setReviews(response);
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">
                {product?.rating?.average}
              </div>
              <div className="flex">
                {renderStars(Number.parseFloat(product?.rating?.average))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {product?.rating?.count} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>

        {product?.rating.count === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.length > 0 &&
              reviews.map((review) => (
                <Card key={review._id} className="w-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        {review.userImage ? (
                          <AvatarImage
                            src={review.userImage || "/placeholder.svg"}
                            alt={review.userName}
                          />
                        ) : null}
                        <AvatarFallback>{review.userInitials}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="font-semibold">
                            {review?.user?.role[0] === "seller" ? (
                              <>Supplier</>
                            ) : (
                              <>
                                {review?.user?.firstName}{" "}
                                {review?.user?.lastName}
                              </>
                            )}
                          </h3>
                          {review?.user?.role[0] === "buyer" && (
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground">
                            {/* {formatDistanceToNow(review.date, {
                            addSuffix: true,
                          })} */}
                          </p>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviewSection;
