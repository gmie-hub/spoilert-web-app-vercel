import { CompletionView } from "./components/CompletionView";
import { InlineMessageCard } from "./components/InlineMessageCard";
import { IntroView } from "./components/IntroView";
import { QuizLoadingState } from "./components/QuizLoadingState";
import { QuizView } from "./components/QuizView";

import type { ReadyPreSpoilQuizScreenState } from "./usePreSpoilQuizScreen";

interface PreSpoilQuizStageContentProps {
  screen: ReadyPreSpoilQuizScreenState;
}

export const PreSpoilQuizStageContent = ({
  screen,
}: PreSpoilQuizStageContentProps) => {
  if (screen.quizStage === "completed") {
    return (
      <CompletionView
        correctAnswersCount={screen.correctAnswersCount}
        hasCertificate={screen.hasCertificate}
        hasPassed={screen.hasPassed}
        isContinuing={screen.isContinuing}
        normalizedQuestions={screen.normalizedQuestions}
        pageTitle={screen.pageTitle}
        quizDetailsData={screen.quizDetailsData}
        quizType={screen.quizType}
        totalQuestionsCount={screen.totalQuestionsCount}
        onRetry={screen.onRetry}
        onStartSpoil={screen.onStartSpoil}
      />
    );
  }

  if (screen.quizStage === "quiz") {
    if (screen.isQuizDetailsLoading) {
      return <QuizLoadingState title={screen.pageTitle} />;
    }

    if (screen.isQuizDetailsError) {
      return (
        <div className="mx-auto mt-10 max-w-[650px]">
          <InlineMessageCard
            message={screen.quizDetailsErrorMessage}
            tone="error"
          />
        </div>
      );
    }

    if (
      !screen.quizDetailsData ||
      screen.normalizedQuestions.length === 0 ||
      !screen.currentQuestion
    ) {
      return (
        <div className="mx-auto mt-10 max-w-[650px]">
          <InlineMessageCard message="Quiz details are unavailable." />
        </div>
      );
    }

    return (
      <QuizView
        currentQuestion={screen.currentQuestion}
        currentQuestionIndex={screen.currentQuestionIndex}
        isLastQuestion={screen.isLastQuestion}
        isSubmitting={screen.isSubmitting}
        normalizedQuestions={screen.normalizedQuestions}
        quizDetailsData={screen.quizDetailsData}
        remainingSeconds={screen.remainingSeconds}
        responses={screen.responses}
        visitedQuestions={screen.visitedQuestions}
        onChangeResponse={screen.onChangeResponse}
        onGoToQuestion={screen.onGoToQuestion}
        onNext={screen.onNext}
        onPrevious={screen.onPrevious}
      />
    );
  }

  return (
    <IntroView
      description={screen.description}
      pageTitle={screen.pageTitle}
      primaryButtonLabel={screen.primaryButtonLabel}
      quizStats={screen.quizStats}
      onStart={screen.onStartFlow}
    />
  );
};
