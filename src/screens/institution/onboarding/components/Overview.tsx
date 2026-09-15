import { Card } from "@spt/components";
import Button from "@spt/components/button";

export interface OnboardingStepInfo {
  title: string;
  description: string;
  status: "done" | "active" | "pending";
}

const Overview = ({
  institutionName,
  steps,
  onContinue,
}: {
  institutionName: string;
  steps: OnboardingStepInfo[];
  onContinue: () => void;
}) => {
  const activeIndex = steps.findIndex((step) => step.status === "active");
  const progress = ((activeIndex + 1) / steps.length) * 100;

  return (
    <main className="w-full bg-white">
      <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
        <h1 className="text-2xl font-semibold text-[#212529] sm:text-[28px]">
          Complete Your Institution Set Up
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">{institutionName}</p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--color-green)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <StepRow key={step.title} step={step} index={index} />
          ))}
        </div>

        <Button type="button" className="mt-8 w-full" onClick={onContinue}>
          Continue
        </Button>
      </Card>
    </main>
  );
};

export const StepRow = ({
  step,
  index,
}: {
  step: OnboardingStepInfo;
  index: number;
}) => {
  const isActive = step.status === "active";
  const isDone = step.status === "done";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        isActive
          ? "border-[var(--color-blue-lightest)] bg-[var(--color-blue-lightest)]"
          : "border-gray-100 bg-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          isDone
            ? "bg-[var(--color-yellow)] text-white"
            : isActive
              ? "bg-[var(--color-blue)] text-white"
              : "bg-gray-100 text-gray-400"
        }`}
      >
        {isDone ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 6.5L9.5 17L4 11.5"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          index + 1
        )}
      </span>
      <div>
        <p
          className={`text-sm font-semibold ${
            isActive || isDone ? "text-[#212529]" : "text-gray-400"
          }`}
        >
          {step.title}
        </p>
        <p className={`text-sm ${isActive ? "text-[#6B7280]" : "text-gray-400"}`}>
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default Overview;
