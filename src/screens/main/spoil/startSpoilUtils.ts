import type { SpoilDetailsData } from "@spt/utils/spoils";

export type SpoilModule = SpoilDetailsData["modules"][number];
export type SpoilLesson = SpoilModule["lessons"][number];

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
  if (!value) return "This spoil has no expiry date.";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return `This spoil will expire on ${value}.`;
  }

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  return `This spoil will expire on the ${day}${suffix} ${date.toLocaleDateString(
    "en-GB",
    {
      month: "long",
      year: "numeric",
    },
  )}`;
};

export const getInitialSelection = (spoil: SpoilDetailsData) => {
  const modules = spoil.modules ?? [];

  for (const module of modules) {
    const currentLessonMatch = module.lessons?.find(
      (lesson) => lesson.title === spoil.current_lesson,
    );

    if (currentLessonMatch) {
      return {
        lessonId: currentLessonMatch.id,
        moduleId: module.id,
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

export const isModuleComplete = (
  module: SpoilModule,
  completedLessonIds: Set<number>,
) => {
  if ((module.percentage_completed ?? 0) >= 100) {
    return true;
  }

  if (!module.lessons?.length) {
    return false;
  }

  return module.lessons.every((lesson) => completedLessonIds.has(lesson.id));
};
