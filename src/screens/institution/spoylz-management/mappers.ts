import type { LearnerSpoilProgress } from "@spt/hooks/apiRequests/useGetLearnerSpoilProgressQuery";
import type { SpoilLearner } from "@spt/hooks/apiRequests/useGetSpoilLearnersQuery";

import { toEnrollmentStatus } from "../lecturers/details/mappers";
import { formatDate, formatNaira, humanize } from "../lecturers/utils";

import type { EnrolledStudent, StudentProgressDetails } from "../lecturers/details/components/spoylz/types";
import type { Lecturer } from "../lecturers/types";

// Anything the API doesn't serve shows as "-" rather than a made-up value.
export const NOT_AVAILABLE = "-";

export const formatSpoylzAmount = (pricing?: string | null, amount?: number | string | null) =>
  pricing?.toLowerCase() === "free" ? "Free" : (formatNaira(amount) ?? NOT_AVAILABLE);

export const formatSpoylzType = (type?: string | null) => (type ? humanize(type) : NOT_AVAILABLE);

export const getFullName = (person?: { first_name?: string | null; last_name?: string | null } | null) =>
  `${person?.first_name ?? ""} ${person?.last_name ?? ""}`.trim() || NOT_AVAILABLE;

// is_active 0 means the spoil was disabled.
export const isSpoylzDisabled = (isActive?: number | string | null) => String(isActive) === "0";

// The institution's lecturer record for a spoil's tutor, for their department
// and profile page; null when the tutor isn't one of its lecturers.
export const findLecturer = (lecturers: Lecturer[], tutorId?: number | null) =>
  tutorId == null ? null : (lecturers.find((lecturer) => lecturer.userId === tutorId) ?? null);

export const MULTIPLE_CHOICE = "multiple_choice";
export const FILL_IN_THE_BLANK = "fill_in_the_blank";

// Quiz options come back as a JSON string, an array, or null.
export const parseQuizOptions = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw !== "string" || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const toNumber = (value?: number | string | null) => {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export type LearnerRow = EnrolledStudent & { learnerId: number };

export const toLearnerRow = (learner: SpoilLearner): LearnerRow => ({
  id: String(learner.id),
  learnerId: learner.id,
  name: getFullName(learner),
  avatar: learner.avatar ?? null,
  username: learner.username || learner.email || NOT_AVAILABLE,
  dateEnrolled: formatDate(learner.created_at),
  status: toEnrollmentStatus(learner.status, toNumber(learner.progress_percentage)),
});

// The API names the current module and lesson by id; show the title when the
// spoil has it.
const titleOf = (items: { id: number; title: string }[], id?: number | string | null) => {
  if (id == null || id === "") return null;
  return items.find((item) => String(item.id) === String(id))?.title ?? String(id);
};

const toScore = (score?: number | null) => (score == null ? null : String(score));

export const toLearnerProgress = (row: LearnerRow, data: LearnerSpoilProgress): StudentProgressDetails => {
  const modules = data.modules ?? [];
  const percentage = toNumber(data.learner_spoil?.progress_percentage);
  const enrolledAt = data.learner_spoil?.date_enrolled;

  return {
    ...row,
    dateEnrolled: enrolledAt ? formatDate(enrolledAt) : row.dateEnrolled,
    status: toEnrollmentStatus(data.learner_spoil?.status, percentage) ?? row.status,
    progress: percentage,
    overallModules: data.modules_no ?? (modules.length || null),
    modulesCompleted: data.total_modules_completed ?? null,
    modulesPending: data.total_modules_pending ?? null,
    currentModule: titleOf(modules, data.current_module),
    currentLesson: titleOf(
      modules.flatMap((module) => module.lessons ?? []),
      data.current_lesson,
    ),
    preQuizScore: toScore(data.pre_spoil_quiz?.highest_score),
    postQuizScore: toScore(data.post_spoil_quiz?.highest_score),
    moduleBreakdown: modules.map((module) => ({
      title: module.title,
      lessons: module.lessons?.length ?? null,
      status: toEnrollmentStatus(module.status, module.percentage_completed),
    })),
  };
};
