"use client";

import { useState } from "react";

import { FilterBar } from "@spt/components";

import QuizPreviewPanel from "./QuizPreviewPanel";

import type { QuizSection } from "./quizConstants";

const SECTIONS = ["Pre-Spoylz Quiz", "Post-Spoylz Quiz", "Module Quiz", "Leaderboard"] as const;
type Section = (typeof SECTIONS)[number];
const QUIZ_SECTIONS: QuizSection[] = ["Pre-Spoylz Quiz", "Post-Spoylz Quiz", "Module Quiz"];

const MOCK_LEADERBOARD = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  rank: index + 1,
  name: "Ogunsola Omorinsola",
  score: "5,000",
}));

const getOrdinal = (rank: number) => {
  const remainder10 = rank % 10;
  const remainder100 = rank % 100;
  if (remainder10 === 1 && remainder100 !== 11) return `${rank}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${rank}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${rank}rd`;
  return `${rank}th`;
};

const ChevronRightIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      stroke={active ? "var(--color-blue)" : "#9CA3AF"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RankDiamond = () => (
  <span className="inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[var(--color-blue)]" />
);

const Avatar = () => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const LeaderboardPanel = () => {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = MOCK_LEADERBOARD.filter((entry) => entry.name.toLowerCase().includes(query));

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <FilterBar
        searchPlaceholder="Search for a user..."
        filters={[{ label: "Today" }, { label: "Date Range", type: "date" }]}
        search={search}
        onSearchChange={setSearch}
        onReset={() => setSearch("")}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">Rank</th>
              <th className="py-3 pr-4 font-medium">Name of User</th>
              <th className="py-3 pr-4 font-medium">Score</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-50">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2 text-[#212529]">
                    <RankDiamond />
                    {getOrdinal(entry.rank)}
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar />
                    <span className="text-[#212529]">{entry.name}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-[#212529]">{entry.score}</td>
                <td className="py-4 pr-4">
                  <button
                    type="button"
                    className="whitespace-nowrap rounded-lg border border-[var(--color-blue)] px-4 py-1.5 text-sm font-medium text-[var(--color-blue)]"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SpoylzQuizLeaderboardTab = () => {
  const [activeSection, setActiveSection] = useState<Section>("Leaderboard");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
        {SECTIONS.map((section) => {
          const active = section === activeSection;
          return (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium ${
                active ? "bg-[var(--color-blue-lightest)] text-[var(--color-blue)]" : "text-[#212529] hover:bg-gray-50"
              }`}
            >
              {section}
              <ChevronRightIcon active={active} />
            </button>
          );
        })}
      </div>

      {activeSection === "Leaderboard" && <LeaderboardPanel />}
      {QUIZ_SECTIONS.includes(activeSection as QuizSection) && (
        <QuizPreviewPanel key={activeSection} section={activeSection as QuizSection} />
      )}
    </div>
  );
};

export default SpoylzQuizLeaderboardTab;
