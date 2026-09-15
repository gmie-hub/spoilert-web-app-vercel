import Image from "next/image";

import DoneIcon from "@spt/assets/icons/doeninstitute.svg";
import Button from "@spt/components/button";

const SuccessModal = ({
  title,
  description,
  buttonLabel = "Continue",
  onContinue,
}: {
  title: string;
  description: string;
  buttonLabel?: string;
  onContinue: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-[520px] rounded-2xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.15)] sm:p-10">
      <Image src={DoneIcon} alt="" width={100} height={100} className="mx-auto" />
      <h2 className="mt-6 text-2xl font-semibold text-[#212529] sm:text-[28px]">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#6B7280] sm:text-[15px]">{description}</p>
      <Button type="button" className="mt-8 w-full" onClick={onContinue}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);

export default SuccessModal;
