import type { ModuleQuiz, OutlineData } from "@spt/types";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import type { BasicsFormData } from "../types";

export const pricingModels = ["free", "paid"];

export const buildNumberOptions = (limit: number) =>
  Array.from({ length: limit }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  });

export const pricingOptions = pricingModels.map((pricing) => ({
  label: pricing,
  value: pricing,
}));

export const moduleOptions = buildNumberOptions(20);
export const lessonOptions = buildNumberOptions(60);

// Server quizzes are mapped with an id like "pre-193" / "post-195" /
// "module-194". Pull the numeric server quiz id back out so we can fetch its
// questions. Locally-created drafts use a plain timestamp id and return null —
// there's nothing on the server to fetch for those yet.
export const extractServerQuizId = (
  id?: string | number | null,
): string | null => {
  if (id == null) return null;
  const match = String(id).match(/^(?:pre|post|module)-(\d+)$/);
  return match ? match[1] : null;
};

const getDatePart = (value?: string | null) =>
  value ? String(value).split("T")[0].split(" ")[0] : "";

const getTimePart = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const mapLessonTypeForSimple = (lessonType?: string | null) =>
  lessonType === "text" ? "text" : "file";

const mapLessonTypeForOutline = (lessonType?: string | null) => {
  if (lessonType === "text" || lessonType === "pdf" || lessonType === "video") {
    return lessonType;
  }

  return "video";
};

export const mapSpoilDataToForm = (
  spoilData: Partial<SpoilDetailsData>,
): BasicsFormData => {
  const firstLesson = spoilData.modules?.[0]?.lessons?.[0];

  return {
    coverImage: spoilData.cover_image_url ?? null,
    title: spoilData.title ?? "",
    category: String(spoilData.category?.id ?? ""),
    institution: spoilData.institution ?? "",
    courseCode: spoilData.course_code ?? "",
    pricing: spoilData.pricing ?? "",
    amount: spoilData.amount ? String(spoilData.amount) : "",
    expiryDate: getDatePart(spoilData.expires_at),
    moduleCount: spoilData.modules_no ? String(spoilData.modules_no) : "",
    lessonCount: spoilData.lessons_no ? String(spoilData.lessons_no) : "",
    description: spoilData.description ?? "",
    learningOutcome: spoilData.what_to_learn ?? "",
    scheduledDate: getDatePart(spoilData.premiere_at),
    scheduledTime: getTimePart(spoilData.premiere_at),
    is_draft: spoilData.is_draft ? 1 : 0,
    type:
      spoilData.type === "simple" || spoilData.type === "advanced"
        ? spoilData.type
        : undefined,
    lessonType: mapLessonTypeForSimple(firstLesson?.type),
    lessonContent:
      firstLesson?.type === "text"
        ? ((firstLesson as { content?: string | null }).content ?? "")
        : "",
    lessonFile:
      firstLesson?.type && firstLesson.type !== "text"
        ? ((firstLesson as { content_url?: string | null }).content_url ?? null)
        : null,
  };
};

// Match a server module quiz (quizzes[].type === "module") to its module and
// shape it like the locally-created draft quiz so the quiz screens can pre-fill
// it when editing — mirrors how pre/post quizzes are mapped below.
const mapServerModuleQuiz = (
  quizzes: SpoilDetailsData["quizzes"] | undefined,
  moduleId: number | string,
): ModuleQuiz | undefined => {
  const moduleQuiz = quizzes?.find(
    (quiz) =>
      quiz.type === "module" &&
      String(quiz.module_id) === String(moduleId),
  );

  if (!moduleQuiz) {
    return undefined;
  }

  return {
    id: `module-${moduleQuiz.id}`,
    title: moduleQuiz.title ?? "",
    description: moduleQuiz.description ?? "",
    overview: {
      title: moduleQuiz.title ?? "",
      description: moduleQuiz.description ?? "",
      numberOfQuestions:
        moduleQuiz.no_of_questions != null
          ? String(moduleQuiz.no_of_questions)
          : "",
      timeLimit:
        moduleQuiz.time_limit != null ? String(moduleQuiz.time_limit) : "",
      passmark:
        moduleQuiz.pass_mark != null ? String(moduleQuiz.pass_mark) : "",
    },
  };
};

export const mapSpoilDetailsToOutline = (
  spoilData?: Partial<SpoilDetailsData> | null,
): OutlineData => ({
  spoil_id: spoilData?.id,
  modules:
    spoilData?.modules?.map((module) => ({
      id: String(module.id),
      title: module.title ?? "",
      description: module.description ?? "",
      quiz: mapServerModuleQuiz(spoilData?.quizzes, module.id),
      lessons:
        module.lessons?.map((lesson) => ({
          id: String(lesson.id),
          title: lesson.title ?? "",
          type: mapLessonTypeForOutline(lesson.type),
          content:
            lesson.type === "text"
              ? ((lesson as { content?: string | null }).content ?? "")
              : "",
          file:
            lesson.type !== "text"
              ? ((lesson as { content_url?: string | null }).content_url ?? null)
              : null,
          fileName:
            lesson.type !== "text"
              ? ((lesson as { content_url?: string | null }).content_url ?? "")
                  .split("/")
                  .pop()
              : undefined,
          description: "",
        })) ?? [],
    })) ?? [],
  preQuiz: spoilData?.quizzes?.find((quiz) => quiz.type === "pre")
    ? {
        id: `pre-${spoilData.quizzes.find((quiz) => quiz.type === "pre")?.id}`,
        title:
          spoilData.quizzes.find((quiz) => quiz.type === "pre")?.title ?? "",
        description:
          spoilData.quizzes.find((quiz) => quiz.type === "pre")?.description ??
          "",
      }
    : undefined,
  postQuiz: spoilData?.quizzes?.find((quiz) => quiz.type === "post")
    ? {
        id: `post-${spoilData.quizzes.find((quiz) => quiz.type === "post")?.id}`,
        title:
          spoilData.quizzes.find((quiz) => quiz.type === "post")?.title ?? "",
        description:
          spoilData.quizzes.find((quiz) => quiz.type === "post")?.description ??
          "",
      }
    : undefined,
});
