"use client";

import { useState } from "react";

import Image from "next/image";
import { FiCheck, FiChevronLeft } from "react-icons/fi";
import { IoCopyOutline } from "react-icons/io5";
import { LuPin } from "react-icons/lu";

import AboutUsImage from "@spt/assets/images/aboutus3.svg";

interface SponsorshipCode {
  id: string;
  code: string;
  usedBy?: string;
  dateUsed?: string;
}

interface Sponsorship {
  id: string;
  title: string;
  amountPaid: string;
  codesUsed: number;
  totalCodes: number;
  tutorName: string;
  learnersSponsored: number;
  dateSponsored: string;
  codes: SponsorshipCode[];
}

const DUMMY: Sponsorship[] = [
  { id: "1", title: "Understanding Design Principles", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "ABC123", usedBy: "Ogunsola Omorinsola", dateUsed: "12-02-2024" }, { id: "c2", code: "XYZ789" }, { id: "c3", code: "PRE904" }] },
  { id: "2", title: "Finance", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "FIN001", usedBy: "Ogunsola Omorinsola", dateUsed: "15-02-2024" }, { id: "c2", code: "FIN002" }, { id: "c3", code: "FIN003" }] },
  { id: "3", title: "Marketing", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "MKT100", usedBy: "Ogunsola Omorinsola", dateUsed: "16-02-2024" }, { id: "c2", code: "MKT101" }, { id: "c3", code: "MKT102" }] },
  { id: "4", title: "Tech For Beginners", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "TEC200", usedBy: "Ogunsola Omorinsola", dateUsed: "17-02-2024" }, { id: "c2", code: "TEC201" }, { id: "c3", code: "TEC202" }] },
  { id: "5", title: "Branding", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "BRN300", usedBy: "Ogunsola Omorinsola", dateUsed: "18-02-2024" }, { id: "c2", code: "BRN301" }, { id: "c3", code: "BRN302" }] },
  { id: "6", title: "Frontend Development Basics", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "FED400", usedBy: "Ogunsola Omorinsola", dateUsed: "19-02-2024" }, { id: "c2", code: "FED401" }, { id: "c3", code: "FED402" }] },
  { id: "7", title: "Design System", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "DSY500", usedBy: "Ogunsola Omorinsola", dateUsed: "20-02-2024" }, { id: "c2", code: "DSY501" }, { id: "c3", code: "DSY502" }] },
  { id: "8", title: "BCH 404- Pharmacology", amountPaid: "₦150,000", codesUsed: 1, totalCodes: 3, tutorName: "Ogunsola Omorinsola", learnersSponsored: 3, dateSponsored: "14-02-2025", codes: [{ id: "c1", code: "BCH600", usedBy: "Ogunsola Omorinsola", dateUsed: "21-02-2024" }, { id: "c2", code: "BCH601" }, { id: "c3", code: "BCH602" }] },
];

function SponsorshipCard({ item, onClick }: { item: Sponsorship; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl border border-[#EEF3F6] bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-lg sm:h-[80px] sm:w-[80px]">
        <Image src={AboutUsImage} alt={item.title} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-1 pt-1">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#20262D] sm:text-[14px]">
          {item.title}
        </p>
        <p className="text-[13px] text-[#6B7B8D]">
          <span className="font-semibold text-[#20262D]">{item.amountPaid}</span>{" "}
          paid
        </p>
        <p className="text-[12px] text-[#9CA3AF]">
          {item.codesUsed} of {item.totalCodes} codes used
        </p>
      </div>
    </button>
  );
}

function CodeRow({ code, index }: { code: SponsorshipCode; index: number }) {
  const [copied, setCopied] = useState(false);
  const isUsed = Boolean(code.usedBy);

  function handleCopy() {
    navigator.clipboard.writeText(code.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <LuPin className="h-[14px] w-[14px] flex-shrink-0 text-[#F97316]" />
          <span className="text-[13px] text-[#6B7B8D]">
            Code {index + 1}:{" "}
            <span className="font-semibold text-[#20262D]">{code.code}</span>
          </span>
        </div>
        {isUsed && (
          <div className="ml-5 flex flex-col">
            <span className="text-[12px] text-[#9CA3AF]">
              Used By:{" "}
              <span className="font-medium text-[#20262D]">{code.usedBy}</span>
            </span>
            <span className="text-[12px] text-[#9CA3AF]">
              Date Used: {code.dateUsed}
            </span>
          </div>
        )}
      </div>
      {isUsed ? (
        <span className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-[12px] font-medium text-[#6B7B8D]">
          <FiCheck className="h-[13px] w-[13px]" />
          Used
        </span>
      ) : (
        <button
          onClick={handleCopy}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-[#0B5368]/30 px-3 py-1.5 text-[12px] font-medium text-[#0B5368] transition-colors hover:bg-[#EEF3F6]"
        >
          <IoCopyOutline className="h-[14px] w-[14px]" />
          {copied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}

function SponsorshipDetail({ item, onBack }: { item: Sponsorship; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#0B5368] hover:underline"
      >
        <FiChevronLeft className="h-4 w-4" />
        Back
      </button>

      <h2 className="text-[20px] font-semibold text-[#20262D]">
        Sponsorship Details
      </h2>

      {/* Info card */}
      <div className="rounded-xl border border-[#EEF3F6]">
        <div className="px-5 py-4">
          <p className="text-[12px] text-[#9CA3AF]">Spoil Title</p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#20262D]">{item.title}</p>
        </div>

        <div className="border-t border-[#EEF3F6] px-5 py-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Tutor's Name", value: item.tutorName },
              { label: "Learner's Sponsored", value: String(item.learnersSponsored) },
              { label: "Code Used", value: String(item.codesUsed) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[12px] text-[#9CA3AF]">{label}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-[#20262D]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#EEF3F6] px-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Amount Paid", value: item.amountPaid },
              { label: "Date Sponsored", value: item.dateSponsored },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[12px] text-[#9CA3AF]">{label}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-[#20262D]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Codes */}
      <div>
        <h3 className="mb-1 text-[16px] font-semibold text-[#20262D]">Codes</h3>
        <div className="rounded-xl border border-[#EEF3F6] divide-y divide-[#EEF3F6] px-5">
          {item.codes.map((code, i) => (
            <CodeRow key={code.id} code={code} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MySponsorshipsPage() {
  const [selected, setSelected] = useState<Sponsorship | null>(null);

  if (selected) {
    return <SponsorshipDetail item={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[20px] font-semibold text-[#20262D]">My Sponsorships</h2>
        <p className="mt-1 text-[13px] text-[#6B7B8D]">View and manage all your sponsorships.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DUMMY.map((item) => (
          <SponsorshipCard key={item.id} item={item} onClick={() => setSelected(item)} />
        ))}
      </div>
    </div>
  );
}
