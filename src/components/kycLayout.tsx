    "use client";

import React from "react";

import Button from "@spt/components/button";
import Stack from "@spt/components/stack";

interface StepLayoutProps {
  step: number;
  totalSteps?: number;
  title: string;
  description?: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  children: React.ReactNode;
}

const StepLayout = ({
  step,
  totalSteps,
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonDisabled,
  children,
}: StepLayoutProps) => {
  return (
    <main className="w-full max-w-md mx-auto">
      <Stack className="space-y-6">
        {/* Step Indicator */}
        <p className="text-sm text-gray-500">
          Step {step}
          {totalSteps ? ` of ${totalSteps}` : ""}
        </p>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500">
            {description}
          </p>
        )}

        {/* Body (Form goes here) */}
        <div className="space-y-4">
          {children}
        </div>

        {/* CTA Button */}
        <Button
          className="w-full"
          onClick={onButtonClick}
          disabled={buttonDisabled}
        >
          {buttonLabel}
        </Button>
      </Stack>
    </main>
  );
};

export default StepLayout;
