import Image from "next/image";

import DoneIcon from "@spt/assets/icons/doeninstitute.svg";
import { Card } from "@spt/components";
import Button from "@spt/components/button";

import { StepRow, type OnboardingStepInfo } from "./Overview";

const COMPLETED_STEPS: OnboardingStepInfo[] = [
  {
    title: "Institution Profile",
    description: "Basic information and representative details",
    status: "done",
  },
  {
    title: "Create Password",
    description: "Create your log in password, verify your email and phone number",
    status: "done",
  },
  {
    title: "Add Bank Account",
    description: "Required to receive your institution earnings",
    status: "done",
  },
];

const CompletionStep = ({
  onLogin,
  onBackHome,
}: {
  onLogin: () => void;
  onBackHome: () => void;
}) => (
  <main className="w-full bg-white">
    <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
      <Image src={DoneIcon} alt="" width={100} height={100} className="mx-auto" />

      <h1 className="mt-6 text-2xl font-semibold text-[#212529] sm:text-[28px]">
        Account Set Up Complete 🎉
      </h1>
      <p className="mx-auto mt-3 max-w-[440px] text-sm text-[#6B7280] sm:text-[15px]">
        Your account has been set up successfully. You can now log in to your
        institution dashboard and monitor your institution activities
      </p>

      <div className="mt-6 space-y-3 text-left">
        {COMPLETED_STEPS.map((step, index) => (
          <StepRow key={step.title} step={step} index={index} />
        ))}
      </div>

      <Button type="button" className="mt-8 w-full" onClick={onLogin}>
        Log In to your Dashboard
      </Button>
      <Button
        type="button"
        variant="blueOutline"
        className="mt-3 w-full"
        onClick={onBackHome}
      >
        Back to Home
      </Button>
    </Card>
  </main>
);

export default CompletionStep;
