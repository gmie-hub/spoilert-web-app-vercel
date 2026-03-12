const skeletonRows = [1, 2, 3];

export const MyLearningLoadingState = () => (
  <div className="space-y-4 p-4 sm:p-6">
    {skeletonRows.map((row) => (
      <div
        key={row}
        className="rounded-[16px] border border-[#F0F2F4] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-[88px] w-full animate-pulse rounded-[14px] bg-[#EDF1F4] sm:w-[112px]" />
          <div className="flex-1">
            <div className="h-5 w-1/2 animate-pulse rounded bg-[#EDF1F4]" />
            <div className="mt-3 h-6 w-24 animate-pulse rounded-full bg-[#EDF1F4]" />
            <div className="mt-4 h-[6px] w-full animate-pulse rounded-full bg-[#EDF1F4]" />
            <div className="mt-4 h-4 w-36 animate-pulse rounded bg-[#EDF1F4]" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MyLearningLoadingState;

