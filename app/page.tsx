"use client";
import React, { useState, useEffect } from "react";
import { Star, Send, Trash2, CheckCircle } from "lucide-react";

type Review = {
  id: string;
  username: string;
  comment: string;
  rating: number;
  timestamp: number;
  date: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reviews");
    if (saved) setReviews(JSON.parse(saved));
    setLoading(false);
  }, []);

  const saveReviews = (updated: Review[]) => {
    localStorage.setItem("reviews", JSON.stringify(updated));
    setReviews(updated);
  };

  const handleSubmit = () => {
    setError("");

    if (!username.trim() || !comment.trim() || rating === 0) {
      setError("Please fill in all fields and provide a rating");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      username,
      comment,
      rating,
      timestamp: Date.now(),
      date: new Date().toLocaleString(),
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    setUsername("");
    setComment("");
    setRating(0);

    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const openDeleteModal = (review: Review) => {
    setReviewToDelete(review);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!reviewToDelete) return;
    const updated = reviews.filter((r) => r.id !== reviewToDelete.id);
    saveReviews(updated);
    setDeleteModal(false);
    setReviewToDelete(null);
  };

  const StarRating = ({
    value,
    onRate,
    interactive = true,
  }: {
    value: number;
    onRate?: (star: number) => void;
    interactive?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`${
              star <= (interactive ? hoverRating || value : value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Review System
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Review Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Submit Your Review
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <StarRating value={rating} onRate={setRating} />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Write your review..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Send size={20} /> Submit Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews ({reviews.length})
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border p-4 rounded-lg hover:shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{review.username}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      <button
                        onClick={() => openDeleteModal(review)}
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <StarRating value={review.rating} interactive={false} />

                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-2">Delete Review?</h3>
              <p className="mb-4">
                Delete review of{" "}
                <span className="font-semibold">
                  {reviewToDelete?.username}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {showSnackbar && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
            <CheckCircle size={22} />
            Review submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}
