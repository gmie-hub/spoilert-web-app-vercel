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
      pageCrumbLabel: "Take Pre-Spoylz Quiz",
      pageTitle: preSpoilQuiz.title || "Pre-Spoylz Quiz",
      primaryButtonLabel: "Start Quiz",
      quizStats: getPreQuizStats({
        attempts: spoil.pre_spoil_quiz?.attempts ?? 0,
        preSpoilQuiz,
      }),
    };
  }

  return {
    description: `No pre-Spoylz quiz is required for ${spoil.title}. You can begin learning immediately.`,
    pageCrumbLabel: "Start Spoylz",
    pageTitle: spoil.title,
    primaryButtonLabel: "Start Spoylz",
    quizStats: getSpoilStats(spoil),
  };
};

export const getSpoilQuizPageContent = ({
  quizDatum,
  spoil,
  type = "pre",
}: {
  quizDatum: QuizDatum | null;
  spoil: SpoilDetailsData;
  type?: string;
}): PreSpoilQuizPageContent => {
  const t = String(type ?? "pre").toLowerCase();

  if (quizDatum) {
    return {
      description:
        quizDatum.description ||
        (t === "post"
          ? `Test your knowledge after completing ${spoil.title}.`
          : `Test your knowledge before starting ${spoil.title}.`),
      pageCrumbLabel: t === "post" ? "Take Post-Spoylz Quiz" : "Take Pre-Spoylz Quiz",
      pageTitle: quizDatum.title || (t === "post" ? "Post-Spoylz Quiz" : "Pre-Spoylz Quiz"),
      primaryButtonLabel: "Start Quiz",
      quizStats:
        t === "post"
          ? getSpoilStats(spoil)
          : getPreQuizStats({ attempts: spoil.pre_spoil_quiz?.attempts ?? 0, preSpoilQuiz: quizDatum }),
    };
  }

  return {
    description:
      t === "post"
        ? `No post-Spoylz quiz is required for ${spoil.title}.`
        : `No pre-Spoylz quiz is required for ${spoil.title}. You can begin learning immediately.`,
    pageCrumbLabel: t === "post" ? "Post-Spoil Quiz" : "Start Spoylz",
    pageTitle: spoil.title,
    primaryButtonLabel: t === "post" ? "View Spoylz" : "Start Spoylz",
    quizStats: getSpoilStats(spoil),
  };
};
