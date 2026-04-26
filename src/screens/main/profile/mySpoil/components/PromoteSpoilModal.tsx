"use client";

import { type FC, useState } from "react";

import Image from "next/image";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";
import useCreatePromotionMutation from "@spt/hooks/apiRequests/useCreatePromotionMutation";
import { useGetPromotionPackagesQuery } from "@spt/hooks/apiRequests/useGetPromotionPackagesQuery";
import type { SpoilDatum } from "@spt/utils/spoils";

import { formatSpoilPrice, getSpoilMeta } from "../helpers";

interface PromoteSpoilModalProps {
  open: boolean;
  onClose: () => void;
  spoil: SpoilDatum;
  onSuccess?: () => void;
}

const formatAmount = (amount: string) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `N${num.toLocaleString("en-NG")}`;
};

const PromoteSpoilModal: FC<PromoteSpoilModalProps> = ({
  open,
  onClose,
  spoil,
  onSuccess,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const meta = getSpoilMeta(spoil);
  const priceLabel = formatSpoilPrice(spoil);
  const { packages, isLoading: isLoadingPackages, isError } = useGetPromotionPackagesQuery();
  const { createPromotion, isLoading: isSubmitting } = useCreatePromotionMutation();

  const activeId = selectedId ?? packages[0]?.id ?? null;

  const handleContinue = async () => {
    if (activeId === null) return;
    const result = await createPromotion(spoil.id, activeId);
    if (result) {
      const paymentUrl = result.data?.payment_url;
      if (paymentUrl) {
        window.open(paymentUrl, "_blank", "noopener,noreferrer");
      }
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Promote Spoil" size="md">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-[14px] border border-[#F1F4F7] p-3">
          <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[10px] bg-[#E8EEF2]">
            <Image
              src={spoil.cover_image_url}
              alt={spoil.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-medium text-[#20262D]">
              {spoil.title}
            </h4>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[#20262D]">
                {priceLabel}
              </span>
              <span className="rounded-full bg-[#EEF7FB] px-2.5 py-1 text-[10px] font-medium text-[#0B5368]">
                {meta.category}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm leading-[1.7] text-[#5F6B76]">
          Select a promotion package to promote your spoil. This promotion will
          give your spoil more visiblity.
        </p>

        <div className="flex flex-col gap-3">
          {isLoadingPackages ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[72px] animate-pulse rounded-[14px] bg-[#F1F4F7]"
              />
            ))
          ) : isError ? (
            <p className="text-center text-sm text-[#F04438]">
              Failed to load packages. Please try again.
            </p>
          ) : (
            packages.map((pkg) => {
              const isSelected = activeId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedId(pkg.id)}
                  className={`flex items-center gap-3 rounded-[14px] border p-4 text-left transition ${
                    isSelected
                      ? "border-[#0B5368] bg-[#F4FAFC]"
                      : "border-[#E4E7EC] bg-white hover:border-[#B9C8D3]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      isSelected ? "border-[#0B5368]" : "border-[#C4CDD4]"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#0B5368]" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm text-[#4A5560]">
                      {pkg.name}{" "}
                      <span className="font-medium">({pkg.duration} days)</span>
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#20262D]">
                      {formatAmount(pkg.amount)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <Button
          variant="darkBlue"
          className="mt-2 w-full"
          disabled={isLoadingPackages || isSubmitting || activeId === null}
          onClick={handleContinue}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
};

export default PromoteSpoilModal;
