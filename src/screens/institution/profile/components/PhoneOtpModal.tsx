"use client";

import ModalShell from "./ModalShell";
import PhoneOtpForm from "./PhoneOtpForm";

const PhoneOtpModal = ({
  countryCode,
  phoneNumber,
  onClose,
  onVerified,
}: {
  countryCode: string;
  phoneNumber: string;
  onClose: () => void;
  onVerified: () => void;
}) => (
  <ModalShell title="Verify Your Phone Number" onClose={onClose}>
    <p className="mt-2 text-sm text-[#6B7280]">
      We&rsquo;ve sent a 6-digit code to{" "}
      <span className="font-semibold text-[#212529]">
        +{countryCode} {phoneNumber}
      </span>
      . Enter it below to verify your phone number.
    </p>

    <PhoneOtpForm
      countryCode={countryCode}
      phoneNumber={phoneNumber}
      submitLabel="Verify Phone Number"
      onVerified={onVerified}
    />
  </ModalShell>
);

export default PhoneOtpModal;
