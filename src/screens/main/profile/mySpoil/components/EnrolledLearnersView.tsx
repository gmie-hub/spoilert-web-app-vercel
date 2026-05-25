"use client";

import React, { useDeferredValue, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiChevronRight, FiRotateCcw, FiSearch } from "react-icons/fi";

import CalendarIcon from "@spt/assets/icons/calendar.svg";
import FilterIcon from "@spt/assets/icons/filter-search.svg";
import useGetEnrolledLearnersQuery, {
  type EnrolledLearner,
} from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";

interface EnrolledLearnersViewProps {
  spoilId: number;
  onBack: () => void;
  onSelectLearner?: (learner: EnrolledLearner) => void;
}

const statusLabel: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  not_started: "Not Started",
};

const statusStyle: Record<string, string> = {
  completed: "bg-[#EAFAF1] text-[#27AE60]",
  ongoing: "bg-[#FFF8E1] text-[#F59E0B]",
  not_started: "bg-[#F3F4F6] text-[#6B7280]",
};

const DUMMY_LEARNERS: EnrolledLearner[] = [
  { id: 1, status: "completed", created_at: "2024-11-10", learner: { id: 1, first_name: "Amara", last_name: "Okafor" } },
  { id: 2, status: "ongoing", created_at: "2024-12-01", learner: { id: 2, first_name: "Chidi", last_name: "Nwosu" } },
  { id: 3, status: "not_started", created_at: "2025-01-15", learner: { id: 3, first_name: "Fatima", last_name: "Bello" } },
  { id: 4, status: "ongoing", created_at: "2025-02-03", learner: { id: 4, first_name: "Emeka", last_name: "Adeyemi" } },
  { id: 5, status: "completed", created_at: "2025-03-20", learner: { id: 5, first_name: "Ngozi", last_name: "Eze" } },
  { id: 6, status: "not_started", created_at: "2025-04-05", learner: { id: 6, first_name: "Tunde", last_name: "Akinola" } },
];

const getLearnerName = (learner: EnrolledLearner) => {
  const person = learner.learner ?? learner.user;
  if (!person) return "Unknown Learner";
  return `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() || "Unknown Learner";
};

const getLearnerAvatar = (learner: EnrolledLearner) =>
  learner.learner?.avatar ?? learner.user?.avatar ?? null;

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const EnrolledLearnersView: React.FC<EnrolledLearnersViewProps> = ({
  spoilId,
  onBack,
  onSelectLearner,
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const deferredSearch = useDeferredValue(search);

  const { learners, isLoading } = useGetEnrolledLearnersQuery(spoilId);

  const displayLearners = !isLoading && learners.length === 0 ? DUMMY_LEARNERS : learners;

  const filtered = useMemo(() => {
    let list = displayLearners;

    if (statusFilter !== "all") {
      list = list.filter((l) => (l.status ?? "ongoing") === statusFilter);
    }

    const q = deferredSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((l) => getLearnerName(l).toLowerCase().includes(q));
    }

    return list;
  }, [displayLearners, statusFilter, deferredSearch]);

  return (
    <div className="w-full  min-h-screen bg-white">
      {/* Breadcrumb header */}
    <div className="md:px-25 "> 
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
          <button
            type="button"
            onClick={onBack}
            className="text-[#0B5368] hover:underline"
          >
            My Spoils
          </button>
          <span className="text-[#C4C4C4]">/</span>
          <button
            type="button"
            onClick={onBack}
            className="text-[#0B5368] hover:underline"
          >
            Spoil Details
          </button>
          <span className="text-[#C4C4C4]">/</span>
          <span className="text-[#20262D] font-medium">Enrolled Learners</span>
        </nav>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <h1 className="text-xl font-semibold text-[#20262D] mb-5">
          Enrolled Learners
        </h1>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap bg-white border border-[#E9EEF2] rounded-xl px-4 py-2.5 mb-6">
          <div className="flex items-center gap-2 flex-1 min-w-[160px]">
            <FiSearch size={16} className="text-[#8A98A3] shrink-0" />
            <input
              type="text"
              placeholder="Search for a learner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none placeholder:text-[#8A98A3] text-[#20262D] bg-transparent"
            />
          </div>

          <div className="h-5 w-px bg-[#E9EEF2] hidden sm:block" />

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-[#5F6B76] hover:text-[#20262D]"
            >
              <Image src={FilterIcon} alt="filter" width={16} height={16} />
              Filter by
            </button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm text-[#5F6B76] border border-[#E9EEF2] rounded-lg px-3 py-1.5 outline-none bg-white cursor-pointer"
            >
              <option value="all">Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="not_started">Not Started</option>
            </select>

            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-[#5F6B76] hover:text-[#20262D] border border-[#E9EEF2] rounded-lg px-3 py-1.5"
            >
              <Image src={CalendarIcon} alt="date" width={15} height={15} />
              Date Enrolled
            </button>

            <button
              type="button"
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="flex items-center gap-1.5 text-sm text-[#0B5368] hover:opacity-75"
            >
              <FiRotateCcw size={14} />
              Reset Filter
            </button>
          </div>
        </div>

        {/* Learners grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[90px] rounded-2xl bg-[#F3F4F6] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#8A98A3]">
            <p className="text-base font-medium">No learners found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((learner) => {
              const name = getLearnerName(learner);
              const avatar = getLearnerAvatar(learner);
              const status = learner.status ?? "ongoing";
              const date = formatDate(learner.created_at);

              return (
                <button
                  key={learner.id}
                  type="button"
                  onClick={() => {
                    onSelectLearner?.(learner);
                    router.push(`/my-spoils/${spoilId}/enrolled-learners/${learner.id}`);
                  }}
                  className="flex items-start cusor-pointer gap-3 bg-white border border-[#E9EEF2] rounded-2xl px-4 py-4 text-left hover:shadow-md hover:border-[#C4D8E0] transition-all w-full cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden bg-[#E8EEF2]">
                    {avatar ? (
                      <Image src={avatar} alt={name} fill className="object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#0B5368]">
                        {name[0] ?? "?"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#20262D] truncate">{name}</p>
                    <p className="text-xs text-[#8A98A3] mt-0.5">Date Enrolled: {date}</p>
                    <span
                      className={`mt-1.5 inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyle[status] ?? statusStyle.ongoing}`}
                    >
                      {statusLabel[status] ?? "Ongoing"}
                    </span>
                  </div>

                  <FiChevronRight size={16} className="text-[#8A98A3] shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default EnrolledLearnersView;
