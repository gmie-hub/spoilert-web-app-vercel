"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";

interface SpoilChat {
  id: number;
  title: string;
  newMessages: number;
  imgSeed: number;
}

const DUMMY_SPOILS_CREATED: SpoilChat[] = [
  { id: 1, title: "Basic Design principles", newMessages: 5, imgSeed: 20 },
  { id: 2, title: "Basic Design principles", newMessages: 5, imgSeed: 42 },
  { id: 3, title: "Basic Design principles", newMessages: 5, imgSeed: 65 },
  { id: 4, title: "Basic Design principles", newMessages: 5, imgSeed: 88 },
  { id: 5, title: "Basic Design principles", newMessages: 5, imgSeed: 110 },
  { id: 6, title: "Basic Design principles", newMessages: 5, imgSeed: 133 },
  { id: 7, title: "Basic Design principles", newMessages: 5, imgSeed: 156 },
];

type Tab = "created" | "enrolled";

export default function SpoilChatsList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("created");

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:px-[100px]  px-4 pt-6 pb-5 ">
             {/* Back button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-10"
        >
          <FiArrowLeft size={15} />
          Backs
        </button>
      </div>
      
      <div className="max-w-[960px] w-full mx-auto px-5 pt-6 pb-5 flex flex-col flex-1">
   
      </div>
      <div className="max-w-[680px] mx-auto px-6 pt-6 pb-16">
        {/* Title */}
        <h1 className="text-[22px] font-bold text-[#20262D] mb-5">
          Spoil Chats
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-[#E9EEF2]">
          {(["created", "enrolled"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 text-center py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? "text-[#0B5368]"
                  : "text-[#8A98A3] hover:text-[#20262D]"
              }`}
            >
              {tab === "created" ? "Spoils Created" : "Spoils Enrolled"}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B5368]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-2">
          {activeTab === "created" ? (
            <div>
              {DUMMY_SPOILS_CREATED.map((spoil) => (
                <button
                  key={spoil.id}
                  type="button"
                  onClick={() => router.push(`/messages/${spoil.id}`)}
                  className="w-full flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-[#F1F4F7] last:border-0 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0 bg-gray-200">
                    <Image
                      src={`https://picsum.photos/seed/${spoil.imgSeed}/60/60`}
                      alt={spoil.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#20262D]">
                      {spoil.title}
                    </p>
                    <p className="text-xs text-[#8A98A3] mt-1">
                      {spoil.newMessages} new messages
                    </p>
                  </div>

                  {/* Chevron */}
                  <FiChevronRight
                    size={18}
                    className="text-[#C4C4C4] shrink-0"
                  />
                </button>
              ))}
            </div>
          ) : (
            <EnrolledEmptyState onExplore={() => router.push("/")} />
          )}
        </div>
      </div>
    </div>
  );
}

function EnrolledEmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-10 gap-6 text-center px-4">
      {/* Illustration */}
      <div className="relative w-[120px] h-[120px]">
        {/* Outer circle */}
        <div className="w-full h-full rounded-full bg-[#F3F4F6] flex items-center justify-center">
          {/* Document shape */}
          <div className="flex flex-col gap-2 items-start px-3">
            <div className="w-12 h-[5px] bg-[#D1D5DB] rounded-full" />
            <div className="w-12 h-[5px] bg-[#D1D5DB] rounded-full" />
            <div className="w-8 h-[5px] bg-[#D1D5DB] rounded-full" />
          </div>
        </div>

        {/* Teal card badge overlay — top-right */}
        <div className="absolute top-1 right-0 w-[52px] h-[30px] bg-[#0B5368] rounded-lg flex items-center gap-1.5 px-2.5 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-white shrink-0" />
          <div className="flex-1 h-[3px] bg-white/50 rounded-full" />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <p className="font-bold text-[#20262D] text-base">
          You Are Not Enrolled to Any Spoil! 👀
        </p>
        <p className="text-sm text-[#8A98A3] leading-relaxed max-w-[300px] mx-auto">
          Enroll in a spoil, start learning and access your chats here
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onExplore}
        className="w-full max-w-[340px] bg-[#0B5368] text-white py-4 rounded-2xl font-semibold text-sm hover:bg-[#0a4a5a] transition-colors"
      >
        Explore Spoils
      </button>
    </div>
  );
}
