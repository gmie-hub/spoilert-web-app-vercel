import { STEPPER_LABELS, type SignupStep } from "../constants";

const STEP_ORDER: Exclude<SignupStep, "success">[] = [
  "institution",
  "contact",
  "review",
];

const StepIndicator = ({ activeStep }: { activeStep: SignupStep }) => {
  const activeIndex = STEP_ORDER.indexOf(activeStep as any);

  return (
    <div className="mt-6 flex items-center">
      {STEP_ORDER.map((key, index) => {
        const isDone = index <= activeIndex;
        return (
          <div key={key} className="flex flex-1 items-center last:flex-none">
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                  isDone
                    ? "bg-[var(--color-blue)] text-white"
                    : "border border-gray-300 text-gray-400"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`whitespace-nowrap text-sm ${
                  index === activeIndex
                    ? "font-semibold text-[#212529]"
                    : isDone
                      ? "font-medium text-[#212529]"
                      : "text-gray-400"
                }`}
              >
                {STEPPER_LABELS[key]}
              </span>
            </div>
            {index < STEP_ORDER.length - 1 && (
              <span className="mx-3 h-px flex-1 bg-gray-200" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
