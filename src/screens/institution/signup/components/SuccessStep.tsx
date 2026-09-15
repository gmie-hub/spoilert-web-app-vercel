import Image from "next/image";

import DoneIcon from "@spt/assets/icons/doeninstitute.svg";
import Button from "@spt/components/button";

const SuccessStep = ({
  onContinue,
  onGotMail,
}: {
  onContinue: () => void;
  onGotMail: () => void;
}) => (
  <div className="flex flex-col items-center py-4 text-center">
    <Image src={DoneIcon} alt="" width={96} height={96} />

    <h1 className="mt-8 text-[28px] font-semibold tracking-[-0.03em] text-[#212529] sm:text-[32px]">
      Application Submitted Successfully 🎉
    </h1>
    <p className="mt-3 max-w-[380px] text-sm leading-7 text-[#6B7280] sm:text-[15px]">
      Your institution application has been submitted successfully. Our team
      will review your application and contact you by email once a decision
      has been made.
    </p>

    <Button type="button" className="mt-8 w-full" onClick={onContinue}>
      Back to Home
    </Button>
    <Button
      type="button"
      variant="outline"
      className="mt-4 w-full"
      onClick={onGotMail}
    >
      Got Mail
    </Button>
  </div>
);

export default SuccessStep;
