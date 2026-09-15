const REVIEW_TEXT =
  "I totally like the Spoylz. It was simple and well explanatory. I love Spoylz like this and I totally recommend, so simple to understand.";

const MOCK_REVIEWS = Array.from({ length: 9 }, (_, index) => ({
  id: String(index + 1),
  name: "Omorinsola Ogunsola",
  rating: 4,
  text: REVIEW_TEXT,
  dateTime: "10/01/2026 | 11:40am",
}));

const Avatar = () => (
  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const StarRating = ({ rating, outOf = 5 }: { rating: number; outOf?: number }) => (
  <div className="mt-1.5 flex items-center gap-0.5">
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

const SpoylzReviewsTab = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {MOCK_REVIEWS.map((review) => (
        <div key={review.id} className="rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <Avatar />
            <p className="font-semibold text-[#212529]">{review.name}</p>
          </div>
          <StarRating rating={review.rating} />
          <p className="mt-3 text-sm text-gray-500">{review.text}</p>
          <p className="mt-3 text-xs text-gray-400">{review.dateTime}</p>
        </div>
      ))}
    </div>
  </div>
);

export default SpoylzReviewsTab;
