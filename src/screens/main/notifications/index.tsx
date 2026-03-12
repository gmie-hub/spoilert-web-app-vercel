

"use client";

import { type FC, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import BackIcon from "@spt/assets/icons/arrow-left.svg";
import Card from "@spt/components/card";

const sampleNotifications = [
  {
    id: 1,
    title: "Your identity has been verified successfully🎉",
    time: "Today | 11:30pm",
    unread: true,
    content:
      "Your identity verification was successful. You can now access all platform features.",
  },
  {
    id: 2,
    title: "Your withdrawal of N10,000 was rejected ❌",
    time: "25-03-2025 | 11:30pm",
    unread: true,
    content:
      "Your withdrawal request was rejected. Please check your account details or contact support.",
  },
  {
    id: 3,
    title: 'Your Spoil "Basics of Design Principles" was rejected ❌',
    time: "23-03-2025 | 11:30pm",
    content:
      "Your spoil did not meet the platform guidelines. Kindly review and resubmit.",
  },
  {
    id: 4,
    title: "Ogunsola Omorinsola just posted a new spoil🚀",
    time: "15-03-2025 | 11:30pm",
    content:
      "Check out the new spoil posted by Ogunsola Omorinsola on the platform.",
  },
  {
    id: 5,
    title: 'Your Spoil "Introduction to Branding" Has Been Approved🎉',
    time: "28-02-2025 | 11:30pm",
    content:
      "Congratulations! Your spoil has been approved and is now visible to other users.",
  },
];

const NotificationsPage: FC = () => {
  const router = useRouter();

  const [openId, setOpenId] = useState<number | null>(null);

  const toggleNotification = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 md:px-[100px] py-6">
      <div className="mb-4 md:mb-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#013B4D] hover:opacity-90"
        >
          <Image src={BackIcon} alt="Back" width={18} height={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <Card className="rounded-3xl bg-white">
            <div className="space-y-2">
              <h1 className="text-lg font-semibold text-black">
                Notifications
              </h1>

              <div className="flex w-full items-center justify-between">
                <button className="text-sm text-red-500">
                  Clear All Notifications
                </button>
                <button className="text-sm text-[#E08A4B]">
                  Mark All As Read
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {sampleNotifications.map((n) => {
                const isOpen = openId === n.id;

                return (
                  <div
                    key={n.id}
                    onClick={() => toggleNotification(n.id)}
                    className={`cursor-pointer rounded-2xl border ${
                      n.unread
                        ? "bg-[#EAF6F9] border-transparent"
                        : "bg-white border-[#EFEFEF]"
                    } p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F0FAFB]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 22c1.1046 0 2-.8954 2-2h-4c0 1.1046.8954 2 2 2z"
                              fill="#9BBFD0"
                            />
                            <path
                              d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                              fill="#9BBFD0"
                            />
                          </svg>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-black">
                            {n.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">{n.time}</p>
                        </div>
                      </div>

                      <button
                        className={`text-sm text-[#9AA6AA] transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pl-13 text-sm text-gray-600">
                        {n.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
