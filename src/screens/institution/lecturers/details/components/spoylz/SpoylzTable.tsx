"use client";

import { useState } from "react";

import { FilterBar, Pagination } from "@spt/components";

import Badge from "./Badge";
import type { SpoylzItem } from "./constants";

const SpoylzTable = ({
  spoylz,
  onViewMore,
}: {
  spoylz: SpoylzItem[];
  onViewMore: (item: SpoylzItem) => void;
}) => {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const filtered = spoylz.filter((item) =>
    item.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <FilterBar
        searchPlaceholder="Search for a Spoylz..."
        filters={[{ label: "Status" }, { label: "Date Created", type: "date" }]}
        search={search}
        onSearchChange={setSearch}
        onReset={() => setSearch("")}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">S/N</th>
              <th className="py-3 pr-4 font-medium">Spoylz Title</th>
              <th className="py-3 pr-4 font-medium">Spoylz Amount</th>
              <th className="py-3 pr-4 font-medium">Enrolled Students</th>
              <th className="py-3 pr-4 font-medium">Amount Earned by Lecturer</th>
              <th className="py-3 pr-4 font-medium">Amount Earned by Institution</th>
              <th className="py-3 pr-4 font-medium">Date Created</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-4 pr-4 text-gray-500">{index + 1}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 shrink-0 rounded-lg"
                      style={{ backgroundColor: item.thumbnailColor }}
                    />
                    <span className="text-[#212529]">{item.title}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-[#212529]">{item.amount}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.enrolledStudents}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.earnedByLecturer}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.earnedByInstitution}</td>
                <td className="py-4 pr-4 text-gray-500">{item.dateCreated}</td>
                <td className="py-4 pr-4">
                  <Badge label={item.status} />
                </td>
                <td className="py-4 pr-4">
                  <button
                    type="button"
                    onClick={() => onViewMore(item)}
                    className="whitespace-nowrap rounded-lg border border-[var(--color-blue)] px-4 py-1.5 text-sm font-medium text-[var(--color-blue)]"
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination activePage={activePage} onPageChange={setActivePage} />
    </div>
  );
};

export default SpoylzTable;
