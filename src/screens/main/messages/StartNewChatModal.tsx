"use client";

import { useEffect, useMemo, useState } from "react";

import { FiChevronRight, FiSearch, FiX } from "react-icons/fi";

import { ChatAvatar } from "@spt/screens/main/profile/mySpoil/components/chatView/ChatAvatar";

export interface ModalContact {
  id: string;
  name: string;
  avatar?: string | null;
  email?: string | null;
  username?: string | null;
}

const ITEMS_PER_PAGE = 12;

/* ─── Helpers ───────────────────────────────────────────── */

function groupByLetter(contacts: ModalContact[]): [string, ModalContact[]][] {
  const map = new Map<string, ModalContact[]>();
  for (const c of contacts) {
    const letter = /[a-z]/i.test(c.name[0] ?? "") ? c.name[0].toUpperCase() : "#";
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(c);
  }
  return Array.from(map.entries());
}

function getPaginationItems(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total - 2, total - 1, total];
  if (current >= total - 2) return [1, 2, 3, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

/* ─── Component ─────────────────────────────────────────── */

interface Props {
  /** Everyone the user can start a chat with. */
  contacts: ModalContact[];
  onClose: () => void;
  onSelectContact: (contact: ModalContact) => void;
}

export default function StartNewChatModal({ contacts, onClose, onSelectContact }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* sort + filter + paginate */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...contacts]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((c) =>
        [c.name, c.email, c.username].some((value) => value?.toLowerCase().includes(term)),
      );
  }, [contacts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const pageContacts = useMemo(
    () => filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [filtered, safePage],
  );

  const groups = groupByLetter(pageContacts);
  const paginationItems = getPaginationItems(safePage, totalPages);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-[420px] sm:max-w-[calc(100vw-32px)] flex flex-col overflow-hidden shadow-xl h-[90vh] sm:h-auto sm:max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Start new chat"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F4F7] shrink-0">
          <h2 className="text-base font-semibold text-[#20262D]">Start New Chat</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center text-[#8A98A3] hover:text-[#20262D] transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Search ── */}
        <div className="px-5 pt-4 pb-2 shrink-0">
          <label className="flex items-center gap-2 border border-[#E9EEF2] rounded-xl px-3 py-2.5 cursor-text">
            <FiSearch size={15} className="text-[#8A98A3] shrink-0" />
            <input
              type="text"
              placeholder="Search for a user, email address"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 text-sm outline-none placeholder:text-[#8A98A3] text-[#20262D] bg-transparent"
            />
          </label>
        </div>

        {/* ── Contact list ── */}
        <div className="flex-1 overflow-y-auto px-0">
          {groups.length === 0 ? (
            <p className="text-sm text-[#8A98A3] text-center py-10 px-6">
              {contacts.length === 0
                ? "No learners have enrolled on this Spoylz yet."
                : "No contacts found"}
            </p>
          ) : (
            groups.map(([letter, letterContacts]) => (
              <div key={letter}>
                {/* Letter header */}
                <p className="text-xs font-medium text-[#8A98A3] px-5 pt-4 pb-2">{letter}</p>

                {/* Contacts in this group */}
                {letterContacts.map((contact, idx) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      onSelectContact(contact);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F8FAFB] transition-colors cursor-pointer text-left ${
                      idx < letterContacts.length - 1 ? "border-b border-[#F1F4F7]" : ""
                    }`}
                  >
                    <ChatAvatar userId={contact.id} name={contact.name} avatar={contact.avatar} size={36} />

                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-[#20262D] truncate">{contact.name}</span>
                      {contact.email && (
                        <span className="block text-xs text-[#8A98A3] truncate">{contact.email}</span>
                      )}
                    </span>

                    <FiChevronRight size={16} className="text-[#C4C4C4] shrink-0" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-[#F1F4F7] shrink-0">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1.5 text-xs text-[#20262D] border border-[#E9EEF2] rounded-lg px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-default"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1">
              {paginationItems.map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`} className="text-xs text-[#8A98A3] px-1">
                    ..
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    className={`min-w-[26px] h-[26px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      safePage === item
                        ? "bg-[#0B5368] text-white"
                        : "text-[#20262D] hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1.5 text-xs text-[#20262D] border border-[#E9EEF2] rounded-lg px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-default"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
