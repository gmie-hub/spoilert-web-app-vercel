"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import { FiChevronRight, FiSearch, FiX } from "react-icons/fi";

/* ─── Dummy contacts data ──────────────────────────────────────── */

interface ModalContact {
  id: number;
  name: string;
  imgSeed: number;
}

const ALL_CONTACTS: ModalContact[] = [
  /* A */ { id: 1,  name: "Abiodun Adeyemi",    imgSeed: 11  },
          { id: 2,  name: "Adaeze Nwosu",        imgSeed: 22  },
          { id: 3,  name: "Aisha Abdullahi",     imgSeed: 33  },
          { id: 4,  name: "Alexander Lawson",    imgSeed: 44  },
          { id: 5,  name: "Ayomide Adebayo",     imgSeed: 55  },
  /* B */ { id: 6,  name: "Babatunde Balogun",   imgSeed: 66  },
          { id: 7,  name: "Bashirat Lawal",      imgSeed: 77  },
          { id: 8,  name: "Binyelum Okeke",      imgSeed: 88  },
          { id: 9,  name: "Benjamin Brooks",     imgSeed: 99  },
  /* C */ { id: 10, name: "Caleb Junior",        imgSeed: 111 },
          { id: 11, name: "Camilia Bednar",      imgSeed: 122 },
          { id: 12, name: "Catherine Ooja",      imgSeed: 133 },
  /* D */ { id: 13, name: "Damilola Adesanya",   imgSeed: 144 },
          { id: 14, name: "David Okonkwo",       imgSeed: 155 },
          { id: 15, name: "Deborah Nwosu",       imgSeed: 166 },
  /* E */ { id: 16, name: "Emeka Eze",           imgSeed: 177 },
          { id: 17, name: "Emmanuel Obi",        imgSeed: 188 },
  /* F */ { id: 18, name: "Fatima Bello",        imgSeed: 199 },
          { id: 19, name: "Funke Akindele",      imgSeed: 210 },
  /* G */ { id: 20, name: "Grace Obi",           imgSeed: 221 },
          { id: 21, name: "Gloria Adekunle",     imgSeed: 232 },
  /* H */ { id: 22, name: "Henry Okafor",        imgSeed: 243 },
          { id: 23, name: "Hope Adewale",        imgSeed: 254 },
  /* I */ { id: 24, name: "Ibrahim Musa",        imgSeed: 265 },
  /* J */ { id: 25, name: "James Fortune",       imgSeed: 276 },
          { id: 26, name: "Jennifer Osei",       imgSeed: 287 },
  /* K */ { id: 27, name: "Kemi Adeola",         imgSeed: 298 },
          { id: 28, name: "Kunle Oladele",       imgSeed: 309 },
  /* L */ { id: 29, name: "Laila Mohammed",      imgSeed: 320 },
          { id: 30, name: "Lola Adeyemi",        imgSeed: 331 },
  /* M */ { id: 31, name: "Michael Chukwu",      imgSeed: 342 },
          { id: 32, name: "Musa Abdullahi",      imgSeed: 353 },
  /* N */ { id: 33, name: "Ngozi Eze",           imgSeed: 364 },
          { id: 34, name: "Nnamdi Obi",          imgSeed: 375 },
  /* O */ { id: 35, name: "Ola Adesanya",        imgSeed: 386 },
          { id: 36, name: "Olumide Bello",       imgSeed: 397 },
  /* P */ { id: 37, name: "Peace Okonkwo",       imgSeed: 408 },
  /* R */ { id: 38, name: "Rachel Adewale",      imgSeed: 419 },
          { id: 39, name: "Richard Nwosu",       imgSeed: 430 },
  /* S */ { id: 40, name: "Samuel Afolabi",      imgSeed: 441 },
          { id: 41, name: "Sophia Lawson",       imgSeed: 452 },
  /* T */ { id: 42, name: "Tunde Okafor",        imgSeed: 463 },
          { id: 43, name: "Taiwo Adesanya",      imgSeed: 474 },
  /* U */ { id: 44, name: "Uche Eze",            imgSeed: 485 },
  /* V */ { id: 45, name: "Victor Obi",          imgSeed: 496 },
  /* Y */ { id: 46, name: "Yemi Adeyemi",        imgSeed: 507 },
          { id: 47, name: "Yusuf Mohammed",      imgSeed: 518 },
  /* Z */ { id: 48, name: "Zainab Bello",        imgSeed: 529 },
];

const ITEMS_PER_PAGE = 12;
const TOTAL_PAGES = Math.ceil(ALL_CONTACTS.length / ITEMS_PER_PAGE);

/* ─── Helpers ─────────────────────────────────────────────────── */

function groupByLetter(contacts: ModalContact[]): [string, ModalContact[]][] {
  const map = new Map<string, ModalContact[]>();
  for (const c of contacts) {
    const letter = c.name[0]!.toUpperCase();
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

/* ─── Component ───────────────────────────────────────────────── */

interface Props {
  onClose: () => void;
  onSelectContact?: (contact: ModalContact) => void;
}

export default function StartNewChatModal({ onClose, onSelectContact }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* filter + paginate */
  const filtered = useMemo(
    () =>
      ALL_CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="relative bg-white rounded-2xl w-[420px] max-w-[calc(100vw-32px)] flex flex-col overflow-hidden shadow-xl"
        style={{ maxHeight: "min(700px, 90vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F4F7] shrink-0">
          <h2 className="text-base font-semibold text-[#20262D]">Start New Chat</h2>
          <button
            type="button"
            onClick={onClose}
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
            <p className="text-sm text-[#8A98A3] text-center py-10">No contacts found</p>
          ) : (
            groups.map(([letter, contacts]) => (
              <div key={letter}>
                {/* Letter header */}
                <p className="text-xs font-medium text-[#8A98A3] px-5 pt-4 pb-2">{letter}</p>

                {/* Contacts in this group */}
                {contacts.map((contact, idx) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      onSelectContact?.(contact);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F8FAFB] transition-colors cursor-pointer text-left ${
                      idx < contacts.length - 1 ? "border-b border-[#F1F4F7]" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gray-200">
                      <Image
                        src={`https://picsum.photos/seed/${contact.imgSeed}/40/40`}
                        alt={contact.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Name */}
                    <p className="flex-1 text-sm text-[#20262D] truncate">{contact.name}</p>

                    {/* Chevron */}
                    <FiChevronRight size={16} className="text-[#C4C4C4] shrink-0" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-[#F1F4F7] shrink-0">
          {/* Previous */}
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1.5 text-xs text-[#20262D] border border-[#E9EEF2] rounded-lg px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-default"
          >
            ← Previous
          </button>

          {/* Page numbers */}
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
                  onClick={() => setPage(item as number)}
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

          {/* Next */}
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1.5 text-xs text-[#20262D] border border-[#E9EEF2] rounded-lg px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-default"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
