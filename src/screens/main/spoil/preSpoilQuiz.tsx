"use client";

import { Breadcrumbs } from "./preSpoilQuiz/components/Breadcrumbs";
import { LoadingState } from "./preSpoilQuiz/components/LoadingState";
import { MessageState } from "./preSpoilQuiz/components/MessageState";
import { PreSpoilQuizStageContent } from "./preSpoilQuiz/StageContent";
import { usePreSpoilQuizScreen } from "./preSpoilQuiz/usePreSpoilQuizScreen";

interface PreSpoilQuizPageProps {
  spoilId: number | string;
  quizType?: "pre" | "post" | "module" | string;
  moduleId?: number | string | null;
}

export default function PreSpoilQuizPage({
  spoilId,
  quizType = "pre",
  moduleId,
}: PreSpoilQuizPageProps) {
  const screen = usePreSpoilQuizScreen({ spoilId, quizType, moduleId });

  if (screen.status === "loading") {
    return <LoadingState />;
  }

  if (screen.status !== "ready") {
    return (
      <MessageState
        message={screen.message}
        tone={screen.status === "error" ? "error" : "default"}
      />
    );
  }

  // Learner already passed this quiz — the screen is redirecting them on to the
  // spoil. Show a placeholder instead of flashing the quiz intro.
  if (screen.hasAlreadyPassed && screen.quizStage === "intro") {
    return <MessageState message="Taking you to your Spoylz..." />;
  }

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <Breadcrumbs
          crumbLabel={screen.breadcrumbLabel}
          onBack={screen.onBack}
          spoilId={screen.spoilId}
        />
        <PreSpoilQuizStageContent screen={screen} />
      </div>
    </section>
  );
}
