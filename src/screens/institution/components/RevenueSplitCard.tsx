// Leave the percentages out when no endpoint serves the agreed split; the card
// then shows "No data" rather than a made-up one.
const RevenueSplitCard = ({
  lecturerPercent,
  institutionPercent,
}: {
  lecturerPercent?: number | null;
  institutionPercent?: number | null;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[var(--color-white-light)] p-6 sm:p-8">
    <h3 className="text-lg font-semibold text-[#212529]">Revenue Split</h3>
    <p className="mt-1 text-sm text-gray-500">
      Revenue from every successful course purchase is automatically shared based on the agreed
      percentage.
    </p>
    {lecturerPercent == null || institutionPercent == null ? (
      <p className="mt-4 text-sm font-medium text-gray-300">No data</p>
    ) : (
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-semibold text-[#212529]">Lecturers ({lecturerPercent}%)</span>
        <span className="text-gray-300">|</span>
        <span className="font-semibold text-[#212529]">Institution ({institutionPercent}%)</span>
      </div>
    )}
  </div>
);

export default RevenueSplitCard;
