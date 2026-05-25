"use client";

import { type FC, useState } from "react";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";
import useCreateSponsorshipMutation from "@spt/hooks/apiRequests/useCreateSponsorshipMutation";
import type { SpoilDetailsData } from "@spt/utils/spoils";

interface SponsorSpoilModalProps {
  open: boolean;
  onClose: () => void;
  spoil: SpoilDetailsData;
  onSuccess?: () => void;
}

const ADMIN_CHARGE_PER_LEARNER = 1000;
const LEARNER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const formatNaira = (value: number) =>
  `N${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SponsorSpoilModal: FC<SponsorSpoilModalProps> = ({
  open,
  onClose,
  spoil,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState<number | null>(null);
  const { createSponsorship, isLoading } = useCreateSponsorshipMutation();

  const tutorName =
    `${spoil.tutor?.first_name ?? ""} ${spoil.tutor?.last_name ?? ""}`.trim() ||
    "Unknown tutor";

  const costPerLearner =
    typeof spoil.display_amount === "number"
      ? spoil.display_amount
      : typeof spoil.amount === "number"
        ? spoil.amount
        : 0;

  const certPerLearner = Number(spoil.certificate_fee) || 0;

  const totalCostFee = quantity ? costPerLearner * quantity : 0;
  const totalAdminCharges = quantity ? ADMIN_CHARGE_PER_LEARNER * quantity : 0;
  const totalCertFee = quantity ? certPerLearner * quantity : 0;
  const subTotal = totalCostFee + totalAdminCharges + totalCertFee;

  const handleProceedToPay = async () => {
    if (!quantity) return;
    const result = await createSponsorship(spoil.id, quantity);
    if (result) {
      const paymentLink = result.data?.payment?.payment_link;
      if (paymentLink) {
        window.open(paymentLink, "_blank", "noopener,noreferrer");
      }
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Sponsor Spoil" size="md">
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-[1.7] text-[#5F6B76]">
          Choose the number of learners you want to sponsor, complete the
          payment, and receive unique codes for them to redeem.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-[#374151]">
              Spoil Title
            </label>
            <input
              readOnly
              value={spoil?.title}
              className="h-12 w-full rounded-xl bg-[#F3F4F6] px-4 text-sm text-[#6B7280] outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-[#374151]">
              Tutor&apos;s Name
            </label>
            <input
              readOnly
              value={tutorName}
              className="h-12 w-full rounded-xl bg-[#F3F4F6] px-4 text-sm text-[#6B7280] outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Number of Learners To sponsor
            </label>
            <div className="relative">
              <select
                value={quantity ?? ""}
                onChange={(e) =>
                  setQuantity(e.target.value ? Number(e.target.value) : null)
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#9CA3AF]"
              >
                <option value="" disabled>
                  Select number of learners
                </option>
                {LEARNER_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                ▾
              </span>
            </div>
          </div>
        </div>

        {quantity && (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">
                Cost Fee (N{costPerLearner.toLocaleString("en-NG")} X {quantity})
              </span>
              <span className="font-medium text-[#111827]">
                {formatNaira(totalCostFee)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">
                Admin charges ({ADMIN_CHARGE_PER_LEARNER.toLocaleString("en-NG")} X {quantity})
              </span>
              <span className="font-medium text-[#111827]">
                {formatNaira(totalAdminCharges)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">
                Certificate Fee ({certPerLearner.toLocaleString("en-NG")} X {quantity})
              </span>
              <span className="font-medium text-[#111827]">
                {formatNaira(totalCertFee)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-[#E7E7E7] pt-3">
              <span className="font-medium text-[#111827]">Sub Total</span>
              <span className="font-semibold text-[#111827]">
                {formatNaira(subTotal)}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="darkBlue"
          className="w-full"
          disabled={!quantity || isLoading}
          onClick={handleProceedToPay}
        >
          {isLoading ? "Processing..." : "Proceed to Pay"}
        </Button>
      </div>
    </Modal>
  );
};

export default SponsorSpoilModal;
