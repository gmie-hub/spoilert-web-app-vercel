"use client";

import { useState } from "react";

import { Pagination } from "@spt/components";
import useGetSpoilReviewsQuery from "@spt/hooks/apiRequests/useGetSpoilReviewsQuery";

import { formatDate, formatTime } from "../../../lecturers/utils";
import { getFullName } from "../../mappers";

const Avatar = () => (
  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const StarRating = ({ rating, outOf = 5 }: { rating: number; outOf?: number }) => (
  <div className="mt-1.5 flex items-center gap-0.5" aria-label={`${rating} out of ${outOf} stars`}>
    {Array.from({ length: outOf }, (_, index) => (
      <svg key={index} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5l2.9 6.1 6.6.7-4.9 4.5 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.7L12 2.5Z"
          fill={index < rating ? "var(--color-yellow)" : "none"}
          stroke="var(--color-yellow)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ))}
  </div>
);

const SpoylzReviewsTab = ({ spoilId }: { spoilId: number }) => {
  const [page, setPage] = useState(1);
  const { reviews, lastPage, isLoading, isError, errorMessage } = useGetSpoilReviewsQuery(spoilId, page);

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl bg-[#F3F4F6]" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-semibold text-[#212529]">This Spoylz hasn&apos;t been reviewed yet</p>
          <p className="mt-1 text-sm text-gray-400">Once a review is available, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <Avatar />
                <p className="font-semibold text-[#212529]">{getFullName(review.user)}</p>
              </div>
              <StarRating rating={Math.max(0, Math.min(5, Math.round(review.rating ?? 0)))} />
              {review.comment && <p className="mt-3 text-sm text-gray-500">{review.comment}</p>}
              <p className="mt-3 text-xs text-gray-400">
                {formatDate(review.created_at)} | {formatTime(review.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}

      {lastPage > 1 && <Pagination activePage={page} totalPages={lastPage} onPageChange={setPage} />}
    </div>
  );
};

export default SpoylzReviewsTab;
