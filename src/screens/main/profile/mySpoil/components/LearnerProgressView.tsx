"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiMessageSquare } from "react-icons/fi";

import type { EnrolledLearner } from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import useGetLearnerProgressQuery, {
  type LearnerProgressData,
} from "@spt/hooks/apiRequests/useGetLearnerProgressQuery";

import { LoadingState } from "../../../spoil/preSpoilQuiz/components/LoadingState";

interface LearnerProgressViewProps {
  spoilId: number;
  learner: EnrolledLearner;
  onBack: () => void;
  onBackToDetail: () => void;
}

const statusLabel: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  not_started: "Not Started",
};

const moduleStatusStyle: Record<string, string> = {
  completed: "bg-[#EAFAF1] text-[#27AE60]",
  ongoing: "bg-[#FFF8E1] text-[#F59E0B]",
  not_started: "bg-[#F3F4F6] text-[#6B7280] border border-[#E9EEF2]",
};

const overallStatusStyle: Record<string, string> = {
  completed: "text-[#27AE60]",
  ongoing: "bg-[#FFF8E1] text-[#F59E0B] px-2.5 py-0.5 rounded-full text-xs font-medium",
  not_started: "text-[#6B7280]",
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const getLearnerName = (learner: EnrolledLearner) => {
  const person = learner.learner ?? learner.user;
  if (!person) return "Unknown Learner";
  return `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() || "Unknown Learner";
};

const getLearnerAvatar = (learner: EnrolledLearner) =>
  learner.learner?.avatar ?? learner.user?.avatar ?? null;

const learnerId = (learner: EnrolledLearner) =>
  learner.learner?.id ?? learner.user_id ?? learner.id;

const DUMMY_PROGRESS: LearnerProgressData = {
  percentage_completed: 65,
  total_modules: 6,
  total_modules_completed: 4,
  total_modules_pending: 2,
  current_module: "Introduction to Design Systems",
  current_lesson: "Component Architecture",
  pre_spoil_quiz_score: 78,
  post_spoil_quiz_score: null,
  date_enrolled: "2025-01-10",
  status: "ongoing",
  modules: [
    { id: 1, title: "Foundations of UI/UX", lessons_no: 5, status: "completed" },
    { id: 2, title: "Color Theory & Typography", lessons_no: 4, status: "completed" },
    { id: 3, title: "Layout & Grid Systems", lessons_no: 6, status: "completed" },
    { id: 4, title: "Introduction to Design Systems", lessons_no: 7, status: "ongoing" },
    { id: 5, title: "Prototyping & Interaction", lessons_no: 5, status: "not_started" },
    { id: 6, title: "Usability Testing", lessons_no: 4, status: "not_started" },
  ],
};

const LearnerProgressView: React.FC<LearnerProgressViewProps> = ({
  spoilId,
  learner,
  onBack,
  onBackToDetail,
}) => {
  const router = useRouter();

  const id = learnerId(learner);
  const { progress, isLoading } = useGetLearnerProgressQuery(spoilId, id);

  const name = getLearnerName(learner);
  const avatar = getLearnerAvatar(learner);

  if (isLoading) return <LoadingState />;

  const data = progress ?? DUMMY_PROGRESS;

  const percentComplete = data.percentage_completed ?? data.progress ?? 0;
  const totalModules = data.total_modules ?? data.modules_no ?? 0;
  const modulesCompleted = data.total_modules_completed ?? data.modules_completed ?? 0;
  const modulesPending = data.total_modules_pending ?? data.modules_pending ?? 0;
  const currentModule = data.current_module ?? "—";
  const currentLesson = data.current_lesson ?? "—";
  const preSpoilScore = data.pre_spoil_quiz_score;
  const postSpoilScore = data.post_spoil_quiz_score;
  const dateEnrolled = formatDate(data.date_enrolled ?? data.created_at ?? learner.created_at);
  const status = data.status ?? learner.status ?? "ongoing";
  const modules = data.modules ?? [];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Breadcrumb header */}
     <div className="md:px-25">
      <div className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-white z-10 border-b border-[#F1F4F7] flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-[#20262D] hover:opacity-70 transition-opacity"
        >
          <FiArrowLeft size={15} />
          Back
        </button>
        <span className="text-[#C4C4C4]">|</span>
        <nav className="flex items-center gap-1 text-sm flex-wrap">
          <button type="button" onClick={onBackToDetail} className="text-[#0B5368] hover:underline">
            My Spoylz
          </button>
          <span className="text-[#C4C4C4]">/</span>
          <button type="button" onClick={onBackToDetail} className="text-[#0B5368] hover:underline">
            Spoylz Details
          </button>
          <span className="text-[#C4C4C4]">/</span>
          <button type="button" onClick={onBack} className="text-[#0B5368] hover:underline">
            Enrolled Learners
          </button>
          <span className="text-[#C4C4C4]">/</span>
          <span className="text-[#20262D] font-medium">Learner&apos;s Progress</span>
        </nav>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <h1 className="text-xl font-semibold text-[#20262D] mb-5">Enrolled Learners</h1>

        {/* Avatar + Send Message */}
        <div className="flex items-center gap-4 mb-7">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#E8EEF2] shrink-0">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover w-10 h-10" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-base font-semibold text-[#0B5368]">
                {name[0] ?? "?"}
              </span>
            )}    
          </div>
          <button
            type="button"
            onClick={() =>
              router.push(`/my-spoils/${spoilId}/enrolled-learners/${learner.id}/chat`)
            }
            className="flex items-center gap-2 border border-[#C4D8E0] rounded-xl px-5 py-2.5 text-sm font-medium text-[#20262D] hover:bg-[#F0F8FB] transition-colors"
          >
            <FiMessageSquare size={16} className="text-[#0B5368]" />
            Send A Message
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Progress */}
          <div className="border border-[#E9EEF2] rounded-2xl p-5 bg-white">
            <h2 className="text-base font-semibold text-[#20262D] mb-4 pb-3 border-b border-[#E9EEF2]">
              Progress
            </h2>
            <div className="space-y-0">
              <Row label="Name of Learner" value={name} large />
              <div className="grid grid-cols-2 border-b border-[#E9EEF2] py-4">
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Progress</p>
                  <p className="text-sm font-semibold text-[#20262D]">{percentComplete}%</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Overall Modules</p>
                  <p className="text-sm font-semibold text-[#20262D]">{totalModules}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9EEF2] py-4">
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Modules Completed</p>
                  <p className="text-sm font-semibold text-[#20262D]">{modulesCompleted}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Modules Pending</p>
                  <p className="text-sm font-semibold text-[#20262D]">{modulesPending}</p>
                </div>
              </div>
              <Row label="Current Module" value={currentModule} />
              <Row label="Current Lesson" value={currentLesson} />
              <div className="grid grid-cols-2 border-b border-[#E9EEF2] py-4">
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Pre-Spoil Quiz Score</p>
                  <p className="text-sm font-semibold text-[#20262D]">
                    {preSpoilScore != null ? preSpoilScore : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Post-Spoil Quiz Score</p>
                  <p className="text-sm font-semibold text-[#20262D]">
                    {postSpoilScore != null ? postSpoilScore : "—"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 py-4">
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Date Enrolled</p>
                  <p className="text-sm font-semibold text-[#20262D]">{dateEnrolled}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A98A3] mb-1">Status</p>
                  <span className={overallStatusStyle[status] ?? overallStatusStyle.ongoing}>
                    {statusLabel[status] ?? "Ongoing"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Progress Breakdown */}
          <div className="border border-[#E9EEF2] rounded-2xl p-5 bg-white">
            <h2 className="text-base font-semibold text-[#20262D] mb-4 pb-3 border-b border-[#E9EEF2]">
              Progress Breakdown
            </h2>
            {modules.length === 0 ? (
              <p className="text-sm text-[#8A98A3]">No module data available.</p>
            ) : (
              <div className="space-y-0">
                {modules.map((mod, index) => {
                  const modStatus =
                    mod.status ??
                    (mod.percentage_completed === 100
                      ? "completed"
                      : mod.percentage_completed
                        ? "ongoing"
                        : "not_started");
                  const lessonCount = mod.lessons_no ?? mod.lessons_count ?? 0;
                  return (
                    <div
                      key={mod.id}
                      className={`py-4 ${index < modules.length - 1 ? "border-b border-[#E9EEF2]" : ""}`}
                    >
                      <p className="text-xs text-[#8A98A3] mb-1">
                        Module {index + 1}{lessonCount > 0 ? ` (${lessonCount} Lessons)` : ""}
                      </p>
                      <p className="text-sm font-medium text-[#20262D] mb-2">{mod.title}</p>
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${moduleStatusStyle[modStatus] ?? moduleStatusStyle.not_started}`}
                      >
                        {statusLabel[modStatus] ?? "Not Started"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) => (
  <div className="py-4 border-b border-[#E9EEF2]">
    <p className="text-xs text-[#8A98A3] mb-1">{label}</p>
    <p className={`font-semibold text-[#20262D] ${large ? "text-base" : "text-sm"}`}>{value}</p>
  </div>
);

export default LearnerProgressView;
