"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { FilterBar, Pagination } from "@spt/components";
import useGetLecturersQuery from "@spt/hooks/apiRequests/useGetLecturersQuery";
import useGetSpoilsPageQuery, { SPOILS_PAGE_SIZE } from "@spt/hooks/apiRequests/useGetSpoilsPageQuery";

import TableStatusRow from "../../lecturers/components/TableStatusRow";
import SpoylzThumbnail from "../../lecturers/details/components/spoylz/SpoylzThumbnail";
import { formatDate, formatNaira } from "../../lecturers/utils";
import {
  NOT_AVAILABLE,
  findLecturer,
  formatSpoylzAmount,
  formatSpoylzType,
  getFullName,
} from "../mappers";

const SEARCH_DELAY_MS = 400;

const Avatar = () => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const SpoylzManagementTable = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);

  // Search runs on the server, so wait for a pause in typing before asking.
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(search.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const { spoils, lastPage, isLoading, isError, errorMessage } = useGetSpoilsPageQuery(activePage, searchQuery);
  const { lecturers } = useGetLecturersQuery();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setActivePage(1);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <FilterBar
        searchPlaceholder="Search for a Spoylz, Lecturer..."
        filters={[{ label: "Category" }, { label: "Date Created", type: "date" }]}
        search={search}
        onSearchChange={handleSearchChange}
        onReset={() => handleSearchChange("")}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">S/N</th>
              <th className="py-3 pr-4 font-medium">Spoylz Title</th>
              <th className="py-3 pr-4 font-medium">Name of Lecturer</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Department</th>
              <th className="py-3 pr-4 font-medium">Spoylz Amount</th>
              <th className="py-3 pr-4 font-medium">Enrolled Students</th>
              <th className="py-3 pr-4 font-medium">Amount Earned by Lecturer</th>
              <th className="py-3 pr-4 font-medium">Amount Earned by Institution</th>
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">Date Created</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isError || spoils.length === 0 ? (
              <TableStatusRow
                colSpan={12}
                isLoading={isLoading}
                errorMessage={isError ? errorMessage : null}
                emptyMessage={searchQuery ? "No Spoylz match your search." : "No Spoylz have been created yet."}
              />
            ) : (
              spoils.map((spoil, index) => (
                <tr key={spoil.id} className="border-b border-gray-50">
                  <td className="py-4 pr-4 text-gray-500">{(activePage - 1) * SPOILS_PAGE_SIZE + index + 1}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <SpoylzThumbnail src={spoil.cover_image_url} alt={spoil.title} />
                      <span className="text-[#212529]">{spoil.title}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar />
                      <span className="text-[#212529]">{getFullName(spoil.tutor)}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[#212529]">{spoil.category?.name || NOT_AVAILABLE}</td>
                  <td className="py-4 pr-4 text-[#212529]">
                    {findLecturer(lecturers, spoil.tutor_id)?.department || NOT_AVAILABLE}
                  </td>
                  <td className="py-4 pr-4 text-[#212529]">{formatSpoylzAmount(spoil.pricing, spoil.amount)}</td>
                  <td className="py-4 pr-4 text-[#212529]">{spoil.enrolled_users ?? 0}</td>
                  <td className="py-4 pr-4 text-[#212529]">{formatNaira(spoil.lecturer_amount) ?? NOT_AVAILABLE}</td>
                  <td className="py-4 pr-4 text-[#212529]">{formatNaira(spoil.institution_amount) ?? NOT_AVAILABLE}</td>
                  <td className="py-4 pr-4 text-[#212529]">{formatSpoylzType(spoil.type)}</td>
                  <td className="py-4 pr-4 text-gray-500">{formatDate(spoil.created_at)}</td>
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => router.push(`/institution/spoylz-management/${spoil.id}`)}
                      className="whitespace-nowrap rounded-lg border border-[var(--color-blue)] px-4 py-1.5 text-sm font-medium text-[var(--color-blue)]"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination activePage={activePage} totalPages={lastPage} onPageChange={setActivePage} />
    </div>
  );
};

export default SpoylzManagementTable;
