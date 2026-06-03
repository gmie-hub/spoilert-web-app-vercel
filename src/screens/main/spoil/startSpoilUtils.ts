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
  if ((module.percentage_completed ?? 0) >= 100) {
    return true;
  }

  if (!module.lessons?.length) {
    return false;
  }

  return module.lessons.every((lesson) => lesson.status === "completed");
};

export type SpoilQuiz = SpoilDetailsData["quizzes"][number];

const isQuizAttempted = (quiz?: SpoilQuiz | null) =>
  (quiz?.attempts?.length ?? 0) > 0;

export interface SpoilQuizGate {
  preQuiz: SpoilQuiz | null;
  postQuiz: SpoilQuiz | null;
  /** Pre-quiz passed (attempted AND reached the pass mark), or there is none. */
  isPreSatisfied: boolean;
  /** Post-quiz taken at least once, or there is none. */
  isPostSatisfied: boolean;
  getModuleQuiz: (moduleId: number) => SpoilQuiz | null;
  /** A module's quiz has been taken at least once, or it has none. */
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

  const isPreSatisfied = (() => {
    if (!preQuiz) return true;

    const attempts = Number(spoil.pre_spoil_quiz?.attempts ?? 0);
    if (attempts <= 0) return false;

    const passMark = preQuiz.pass_mark != null ? Number(preQuiz.pass_mark) : 0;
    const highestScore = Number(spoil.pre_spoil_quiz?.highest_score ?? 0);

    return highestScore >= passMark;
  })();

  const isPostSatisfied = (() => {
    if (!postQuiz) return true;
    const attempts = Number(spoil.post_spoil_quiz?.attempts ?? 0);
    return attempts > 0 || isQuizAttempted(postQuiz);
  })();

  const getModuleQuiz = (moduleId: number) =>
    quizzes.find(
      (quiz) =>
        quiz.type?.toLowerCase() === "module" &&
        Number(quiz.module_id) === Number(moduleId),
    ) ?? null;

  const isModuleQuizSatisfied = (moduleId: number) =>
    isQuizAttempted(getModuleQuiz(moduleId));

  return {
    preQuiz,
    postQuiz,
    isPreSatisfied,
    isPostSatisfied,
    getModuleQuiz,
    isModuleQuizSatisfied,
  };
};

/**
 * A module is unlocked only when every earlier module is fully complete AND its
 * module quiz (if any) has been taken. The first module is always unlocked.
 */
export const isModuleUnlocked = (
  modules: SpoilModule[],
  index: number,
  gate: SpoilQuizGate,
) => {
  for (let i = 0; i < index; i += 1) {
    const previous = modules[i];

    if (!isModuleComplete(previous)) return false;
    if (!gate.isModuleQuizSatisfied(previous.id)) return false;
  }

  return true;
};
