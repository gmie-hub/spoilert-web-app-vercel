import { FC } from 'react';

import Image from 'next/image';

import ActiveIcon   from "@spt/assets/icons/active-step.svg";
import CompletedIcon from "@spt/assets/icons/completed.svg";
import InactiveIcon from "@spt/assets/icons/inactive-step.svg";

interface StepperProps {
  activeStep: number;           // 0-based index
  steps: string[];
  isStepSkipped?: (index: number) => boolean;
}

const CustomStepper: FC<StepperProps> = ({ activeStep, steps, isStepSkipped = () => false }) => {
  return (
    <div className="relative flex flex-col gap-8 py-2">
      {steps.map((label, index) => {
        const isActive    = index === activeStep;
        const isCompleted = index < activeStep && !isStepSkipped(index);
        // const isFuture    = index > activeStep; // not used now

        // Show line ABOVE this step only if:
        //   - this is NOT the first step
        //   AND
        //   - the step before this one is completed
        //     OR
        //   - the step before this one is the active step
        //     OR
        //   - this step is the one immediately after active
        const showLine = index > 0;
        const prevIsCompleted = index - 1 < activeStep && !isStepSkipped(index - 1);
        const prevIsActive    = index - 1 === activeStep;
        const thisIsNextAfterActive = index === activeStep + 1;

        const shouldShowLine = showLine && (
          prevIsCompleted ||
          prevIsActive ||
          thisIsNextAfterActive
        );

        return (
          <div key={label} className="relative flex items-start gap-2">
            <div className="relative flex flex-col items-center">

              {/* Step icon */}
              <div
                className={`
                  relative z-10 flex h-11 w-11 shrink-0 
                  items-center justify-center rounded-full
                  transition-all duration-200
                  ${isActive
                    ? 'scale-110'
                    : isCompleted
                    ? ''
                    : 'bg-white'
                  }
                `}
              >
                {isCompleted ? (
                  <Image src={CompletedIcon} alt="Completed" width={32} height={32} />
                ) : isActive ? (
                  <Image src={ActiveIcon} alt="Active" width={32} height={32} />
                ) : (
                  <Image src={InactiveIcon} alt="Inactive" width={32} height={32} />
                )}
              </div>

              {/* Connecting line – only when explicitly requested by your rule */}
              {shouldShowLine && (
                <div
                  className={`
                    absolute left-1/2 top-[-2rem] h-[calc(100%+2rem)] w-0.5 -translate-x-1/2 bg-[#EAECF0]
                    transition-all duration-200
                  `}
                />
              )}

            </div>

            {/* Label */}
            <div className="min-w-0 pt-3">
              <p
                className={`
                  text-[15px] md:text-base leading-tight font-medium
                  ${isActive    ? 'text-gray '
                  : isCompleted ? 'text-gray'
                  : 'text-gray-400 font-normal'}
                `}
              >
                {label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomStepper;