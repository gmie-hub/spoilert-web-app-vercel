import type { QuizDatum } from "@spt/types/quiz";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import type { QuizStatItem } from "./types";

interface PreSpoilQuizPageContent {
  description: string;
  pageCrumbLabel: string;
  pageTitle: string;
  primaryButtonLabel: string;
  quizStats: QuizStatItem[];
}

const formatAttemptsLabel = (attempts: number) =>
  `${attempts} Attempt${attempts === 1 ? "" : "s"} made`;

const getPreQuizStats = ({
  attempts,
  preSpoilQuiz,
}: {
  attempts: number;
  preSpoilQuiz: QuizDatum;
}): QuizStatItem[] => [
  {
    alt: "Questions",
    icon: "note",
    label: `${preSpoilQuiz.no_of_questions ?? 0} Questions`,
  },
  {
    alt: "Pass Mark",
    icon: "note",
    label: `Pass Mark ${preSpoilQuiz.pass_mark ?? "0"}%`,
  },
  {
    alt: "Attempts",
    icon: "note",
    label: formatAttemptsLabel(attempts),
  },
  {
    alt: "Time Limit",
    icon: "clock",
    label: `${preSpoilQuiz.time_limit ?? 0} Minutes`,
  },
];

const getSpoilStats = (spoil: SpoilDetailsData): QuizStatItem[] => [
  {
    alt: "Modules",
    icon: "note",
    label: `${spoil.modules_no ?? 0} Modules`,
  },
  {
    alt: "Lessons",
    icon: "note",
    label: `${spoil.lessons_no ?? 0} Lessons`,
  },
  {
    alt: "Enrolled users",
    icon: "note",
    label: `${spoil.enrolled_users ?? 0} Enrolled`,
  },
];

export const getPreSpoilQuizPageContent = ({
  preSpoilQuiz,
  spoil,
}: {
  preSpoilQuiz: QuizDatum | null;
  spoil: SpoilDetailsData;
}): PreSpoilQuizPageContent => {
  if (preSpoilQuiz) {
    return {
      description:
        preSpoilQuiz.description ||
        `Test your knowledge before starting ${spoil.title}.`,
      pageCrumbLabel: "Take Pre-Spoil Quiz",
      pageTitle: preSpoilQuiz.title || "Pre-Spoil Quiz",
      primaryButtonLabel: "Start Quiz",
      quizStats: getPreQuizStats({
        attempts: spoil.pre_spoil_quiz?.attempts ?? 0,
        preSpoilQuiz,
      }),
    };
  }

  return {
    description: `No pre-spoil quiz is required for ${spoil.title}. You can begin learning immediately.`,
    pageCrumbLabel: "Start Spoil",
    pageTitle: spoil.title,
    primaryButtonLabel: "Start Spoil",
    quizStats: getSpoilStats(spoil),
  };
};
