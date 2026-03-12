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
        answeredQuestionsCount={screen.answeredQuestionsCount}
        correctAnswersCount={screen.correctAnswersCount}
        normalizedQuestions={screen.normalizedQuestions}
        pageTitle={screen.pageTitle}
        preSpoilQuizPassMark={screen.preSpoilQuizPassMark}
        preSpoilQuizTimeLimit={screen.preSpoilQuizTimeLimit}
        quizDetailsData={screen.quizDetailsData}
        spoilTitle={screen.spoilTitle}
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
