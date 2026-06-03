import { Suspense } from "react";

import ProtectedRoute from "@spt/components/ProtectedRoute";
import MyLearningPage from "@spt/screens/main/spoils/myLearning";
import MyLearningLoadingState from "@spt/screens/main/spoils/myLearning/components/MyLearningLoadingState";

const MyLearningPageFallback = () => (
  <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
    <div className="mx-auto max-w-[1120px]">
      <h1 className="text-[40px] font-semibold tracking-[-0.03em] text-[#212529]">
        My Learnings
      </h1>

      <div className="mx-auto mt-10 max-w-[720px] rounded-[20px] border border-[#ECEFF2] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-2 border-b border-[#E6E8EC]">
          <div className="border-b-2 border-[#0B5368] px-4 py-4 text-center text-sm font-medium text-[#0B5368]">
            Ongoing
          </div>
          <div className="border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium text-[#7C8792]">
            Completed
          </div>
        </div>

        <MyLearningLoadingState />
      </div>
    </div>
  </section>
);

export default function MyLearningRoutePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<MyLearningPageFallback />}>
        <MyLearningPage />
      </Suspense>
    </ProtectedRoute>
  );
}
