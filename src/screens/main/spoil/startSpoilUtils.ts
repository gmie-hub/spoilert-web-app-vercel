import type { SpoilDetailsData } from "@spt/utils/spoils";

export type SpoilModule = SpoilDetailsData["modules"][number];
export type SpoilLesson = SpoilModule["lessons"][number];

// Friendly labels for common file extensions used in lesson content.
const FILE_TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  doc: "DOC",
  docx: "DOC",
  ppt: "Slides",
  pptx: "Slides",
  xls: "Sheet",
  xlsx: "Sheet",
  png: "Image",
  jpg: "Image",
  jpeg: "Image",
  webp: "Image",
  gif: "Image",
  svg: "Image",
  mp4: "Video",
  mov: "Video",
  webm: "Video",
  mp3: "Audio",
  wav: "Audio",
};

/**
 * A human-readable indicator of a lesson's content type. Video/text lessons
 * use their type directly; file lessons resolve the real file type from the
 * content URL's extension (e.g. PDF, Image, Video).
 */
export const getLessonTypeLabel = (lesson: SpoilLesson | null): string => {
  if (!lesson) return "lesson";

  const type = lesson.type?.toLowerCase();
  if (type === "video") return "video";
  if (type === "text") return "text";

  const url = lesson.content_url;
  if (url) {
    const fileName = url.split("?")[0].split("/").pop() ?? "";
    const dotIndex = fileName.lastIndexOf(".");

    if (dotIndex > 0 && dotIndex < fileName.length - 1) {
      const ext = fileName.slice(dotIndex + 1).toLowerCase();
      return FILE_TYPE_LABELS[ext] ?? ext;
    }
  }

  return type || "file";
};

export const getTutorName = (spoil: SpoilDetailsData) => {
  const firstName = spoil.tutor?.first_name ?? "";
  const lastName = spoil.tutor?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unknown tutor";
};

export const getTutorInitials = (spoil: SpoilDetailsData) => {
  const firstInitial = spoil.tutor?.first_name?.[0] ?? "";
  const lastInitial = spoil.tutor?.last_name?.[0] ?? "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "NA";
};

export const splitLearningOutcomes = (value?: string | null) => {
  if (!value) return [];

  const separator = value.includes("\n") ? /\r?\n/ : /,(?!\d)/;

  return value
    .split(separator)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
};

const getOrdinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatExpiryDate = (value?: string | null) => {
  if (!value) return "This Spoylz has no expiry date.";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return `This Spoylz will expire on ${value}.`;
  }

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  return `This Spoylz will expire on the ${day}${suffix} ${date.toLocaleDateString(
    "en-GB",
    {
      month: "long",
      year: "numeric",
    },
  )}`;
};

export const getInitialSelection = (spoil: SpoilDetailsData) => {
  const modules = spoil.modules ?? [];

  for (const spoilModule of modules) {
    const currentLessonMatch = spoilModule.lessons?.find(
      (lesson) => lesson.title === spoil.current_lesson,
    );

    if (currentLessonMatch) {
      return {
        lessonId: currentLessonMatch.id,
        moduleId: spoilModule.id,
      };
    }
  }

  const moduleMatch =
    modules.find((module) => module.title === spoil.current_module) ?? modules[0];

  return {
    lessonId: moduleMatch?.lessons?.[0]?.id ?? null,
    moduleId: moduleMatch?.id ?? null,
  };
};

export const isModuleComplete = (module: SpoilModule) => {
  if (Number(module.percentage_completed ?? 0) >= 100) {
    return true;
  }

  if (module.status?.toLowerCase() === "completed") {
    return true;
  }

  if (!module.lessons?.length) {
    return false;
  }

  return module.lessons.every(
    (lesson) => lesson.status?.toLowerCase() === "completed",
  );
};

export type SpoilQuiz = SpoilDetailsData["quizzes"][number];

type QuizAttemptSummary = SpoilDetailsData["pre_spoil_quiz"] | null;

/** What the learner has done with one quiz. */
export interface QuizStatus {
  /** The spoil actually has this quiz. */
  exists: boolean;
  attempts: number;
  /** Best recorded score, or null when the quiz was never attempted. */
  highestScore: number | null;
  /** Score needed to pass, or null when the quiz sets none. */
  passMark: number | null;
  isTaken: boolean;
  isPassed: boolean;
}

/** Renders a score without trailing zeros: 23 -> "23%", "20.00" -> "20%". */
export const formatQuizScore = (value: number | null) =>
  value === null ? null : `${Number(value)}%`;

const NO_QUIZ_STATUS: QuizStatus = {
  exists: false,
  attempts: 0,
  highestScore: null,
  passMark: null,
  isTaken: false,
  isPassed: false,
};

const toNumberOrNull = (value: unknown): number | null => {
  if (value == null || String(value).trim() === "") return null;

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
};

const getBestAttemptScore = (quiz: SpoilQuiz): number | null => {
  const scores = (quiz.attempts ?? [])
    .map((attempt) => toNumberOrNull(attempt?.score))
    .filter((score): score is number => score !== null);

  return scores.length > 0 ? Math.max(...scores) : null;
};

/**
 * Builds a quiz's learner status. `summary` is the spoil-level attempt summary
 * (`pre_spoil_quiz` / `post_spoil_quiz`); module quizzes have none of their own
 * — `module_spoil_quiz` aggregates every module — so they read the attempts
 * embedded in the quiz itself.
 */
const buildQuizStatus = (
  quiz: SpoilQuiz | null,
  summary?: QuizAttemptSummary,
): QuizStatus => {
  if (!quiz) return NO_QUIZ_STATUS;

  const attempts = Math.max(
    toNumberOrNull(summary?.attempts) ?? 0,
    quiz.attempts?.length ?? 0,
  );
  const highestScore =
    toNumberOrNull(summary?.highest_score) ?? getBestAttemptScore(quiz);
  const passMark = toNumberOrNull(quiz.pass_mark);
  const isTaken = attempts > 0;

  return {
    exists: true,
    attempts,
    highestScore,
    passMark,
    isTaken,
    // With no pass mark set, taking the quiz is enough to pass it.
    isPassed: isTaken && (passMark === null || (highestScore ?? 0) >= passMark),
  };
};

export interface SpoilQuizGate {
  preQuiz: SpoilQuiz | null;
  postQuiz: SpoilQuiz | null;
  preStatus: QuizStatus;
  postStatus: QuizStatus;
  /** Pre-quiz passed (attempted AND reached the pass mark), or there is none. */
  isPreSatisfied: boolean;
  /** Post-quiz taken at least once, or there is none. */
  isPostSatisfied: boolean;
  getModuleQuiz: (moduleId: number) => SpoilQuiz | null;
  getModuleQuizStatus: (moduleId: number) => QuizStatus;
  /** A module's quiz has been passed, or the module has no quiz. */
  isModuleQuizSatisfied: (moduleId: number) => boolean;
}

/**
 * Computes the quiz-gating state for a spoil from its `quizzes` definitions and
 * the learner's attempt summaries (`pre_spoil_quiz` / `post_spoil_quiz`).
 */
export const getSpoilQuizGate = (spoil: SpoilDetailsData): SpoilQuizGate => {
  const quizzes = spoil.quizzes ?? [];

  const preQuiz =
    quizzes.find((quiz) => quiz.type?.toLowerCase() === "pre") ?? null;
  const postQuiz =
    quizzes.find((quiz) => quiz.type?.toLowerCase() === "post") ?? null;

  const preStatus = buildQuizStatus(preQuiz, spoil.pre_spoil_quiz);
  const postStatus = buildQuizStatus(postQuiz, spoil.post_spoil_quiz);

  const getModuleQuiz = (moduleId: number) =>
    quizzes.find(
      (quiz) =>
        quiz.type?.toLowerCase() === "module" &&
        Number(quiz.module_id) === Number(moduleId),
    ) ?? null;

  const getModuleQuizStatus = (moduleId: number) =>
    buildQuizStatus(getModuleQuiz(moduleId));

  return {
    preQuiz,
    postQuiz,
    preStatus,
    postStatus,
    isPreSatisfied: !preQuiz || preStatus.isPassed,
    isPostSatisfied: !postQuiz || postStatus.isTaken,
    getModuleQuiz,
    getModuleQuizStatus,
    isModuleQuizSatisfied: (moduleId: number) =>
      !getModuleQuiz(moduleId) || getModuleQuizStatus(moduleId).isPassed,
  };
};

export type ModuleUnlockBlocker =
  | { module: SpoilModule; quiz: SpoilQuiz; reason: "quiz" }
  | { module: SpoilModule; reason: "incomplete" };

/**
 * Why a later module is still locked. If an earlier module has a quiz that
 * has not been passed, that quiz is the blocker — later content must not open.
 */
export const getModuleUnlockBlocker = (
  modules: SpoilModule[],
  index: number,
  gate: SpoilQuizGate,
): ModuleUnlockBlocker | null => {
  for (let i = 0; i < index; i += 1) {
    const previous = modules[i];
    const quiz = gate.getModuleQuiz(previous.id);

    if (quiz && !gate.isModuleQuizSatisfied(previous.id)) {
      return { reason: "quiz", module: previous, quiz };
    }

    if (!isModuleComplete(previous)) {
      return { reason: "incomplete", module: previous };
    }
  }

  return null;
};

/**
 * A module is unlocked only when every earlier module is fully complete AND its
 * module quiz (if any) has been passed. The first module is always unlocked.
 */
export const isModuleUnlocked = (
  modules: SpoilModule[],
  index: number,
  gate: SpoilQuizGate,
) => getModuleUnlockBlocker(modules, index, gate) === null;
