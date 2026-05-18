"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";

import useGetPromotionDetailsQuery from "@spt/hooks/apiRequests/useGetPromotionDetailsQuery";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

import PromotionMetrics from "./PromotionMetrics";

function formatTimeLeft(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days}d:${hours}h:${minutes}m:${seconds}s`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  return `₦${num.toLocaleString("en-NG")}`;
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(endDate));

  useEffect(() => {
    if (timeLeft === "Expired") return;
    const interval = setInterval(() => {
      const next = formatTimeLeft(endDate);
      setTimeLeft(next);
      if (next === "Expired") clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate, timeLeft]);

  return <span>{timeLeft}</span>;
}

function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-[#8A98A3] mb-1">{label}</p>
      <div className="text-[15px] font-semibold text-[#20262D]">{children}</div>
    </div>
  );
}

export default function PromotionDetailsPage() {
  const [tab, setTab] = useState<"overview" | "metrics">("overview");
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : null;

  const { promotion, isLoading, isError, errorMessage } = useGetPromotionDetailsQuery(id);

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[#003049] text-sm font-medium mb-4"
      >
        <FiChevronLeft className="text-base" />
        Back
      </button>

      <h2 className="text-xl font-semibold text-[#20262D] mb-6">Promotion Details</h2>

      <div className="flex border-b border-[#E9EEF2] mb-6">
        <button
          className={`pb-2 text-base font-semibold transition border-b-2 w-40 ${tab === "overview" ? "border-[#003049] text-[#003049]" : "border-transparent text-[#8A98A3]"}`}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          className={`pb-2 text-base font-semibold transition border-b-2 w-40 ${tab === "metrics" ? "border-[#003049] text-[#003049]" : "border-transparent text-[#8A98A3]"}`}
          onClick={() => setTab("metrics")}
        >
          Metrics
        </button>
      </div>

      {tab === "overview" ? (
        isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message={errorMessage} />
        ) : !promotion ? (
          <p className="text-sm text-[#8A98A3] py-10 text-center">Promotion not found</p>
        ) : (
          <div>
            <div className="mb-5">
              {promotion.spoil?.cover_image_url ? (
                <Image
                  src={promotion.spoil.cover_image_url}
                  alt={promotion.spoil.title}
                  width={64}
                  height={64}
                  className="rounded-xl object-cover w-16 h-16"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#E3F5FA]" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5 border-b border-[#E9EEF2]">
              <InfoField label="Spoil title">{promotion.spoil?.title ?? "—"}</InfoField>
              <InfoField label="Amount">{formatAmount(promotion.amount)}</InfoField>
              <InfoField label="Category">{promotion.spoil?.category?.name ?? "—"}</InfoField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5 border-b border-[#E9EEF2]">
              <InfoField label="Promotion Package">Package #{promotion.promotion_package_id}</InfoField>
              <InfoField label="Promotion Amount">{formatAmount(promotion.amount)}</InfoField>
              <InfoField label="Time Left"><CountdownTimer endDate={promotion.end_date} /></InfoField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
              <InfoField label="Start Date">{formatDate(promotion.start_date)}</InfoField>
              <InfoField label="End Date">{formatDate(promotion.end_date)}</InfoField>
              <InfoField label="Status">
                <span
                  className={`inline-block text-sm font-medium rounded-full px-4 py-1 ${
                    promotion.status === "active"
                      ? "bg-[#E6FAF7] text-[#1CC8A5]"
                      : "bg-[#F5F5F5] text-[#8A98A3]"
                  }`}
                >
                  {promotion.status === "active" ? "Active" : "Expired"}
                </span>
              </InfoField>
            </div>
          </div>
        )
      ) : (
        <PromotionMetrics />
      )}
    </div>
  );
}
