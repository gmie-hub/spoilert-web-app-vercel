import type { EarningSpoil } from "@spt/hooks/apiRequests/useGetEarningsBreakdownQuery";
import type { EnrolledLearner } from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import type { LearnerProgressData } from "@spt/hooks/apiRequests/useGetLearnerProgressQuery";
import type { LecturerSpoil } from "@spt/hooks/apiRequests/useGetLecturerSpoilsQuery";
import type { PaymentDatum } from "@spt/hooks/apiRequests/useGetPaymentsQuery";
import { splitLearningOutcomes } from "@spt/screens/main/spoil/startSpoilUtils";

import { formatDate, formatNaira, formatTime, humanize } from "../utils";

import type {
  EnrolledStudent,
  EnrollmentStatus,
  SpoylzItem,
  StudentProgressDetails,
} from "./components/spoylz/types";
import type { Transaction, TransactionKind } from "./components/transactions/types";

// Anything the API doesn't serve shows as "-" rather than a made-up value.
const NOT_AVAILABLE = "-";

export const formatSpoilAmount = (spoil: LecturerSpoil) =>
  spoil.pricing?.toLowerCase() === "free" ? "Free" : (formatNaira(spoil.amount) ?? NOT_AVAILABLE);

// The earnings breakdown names each spoil but doesn't give its id, so its rows
// are paired with spoils by title, and only where the title is unique on both
// sides, so a row never lands on the wrong spoil.
export const pairEarningsByTitle = (spoils: LecturerSpoil[], earnings: EarningSpoil[]) => {
  const countTitles = (titles: string[]) =>
    titles.reduce((counts, title) => counts.set(title, (counts.get(title) ?? 0) + 1), new Map<string, number>());
  const spoilTitles = countTitles(spoils.map((spoil) => spoil.title));
  const earningTitles = countTitles(earnings.map((earning) => earning.spoil_name));
  const isUnique = (title: string) => spoilTitles.get(title) === 1 && earningTitles.get(title) === 1;

  return {
    earningFor: (spoil: LecturerSpoil) =>
      isUnique(spoil.title) ? (earnings.find((earning) => earning.spoil_name === spoil.title) ?? null) : null,
    spoilFor: (earning: EarningSpoil) =>
      isUnique(earning.spoil_name) ? (spoils.find((spoil) => spoil.title === earning.spoil_name) ?? null) : null,
  };
};

export const toSpoylzItem = (spoil: LecturerSpoil, earning: EarningSpoil | null): SpoylzItem => ({
  id: String(spoil.id),
  title: spoil.title,
  coverImage: spoil.cover_image_url || null,
  pricing: spoil.pricing ? humanize(spoil.pricing) : NOT_AVAILABLE,
  amount: formatSpoilAmount(spoil),
  enrolledStudents: spoil.enrolled_users ?? 0,
  earnedByLecturer: formatNaira(earning?.total_amount) ?? NOT_AVAILABLE,
  // No endpoint serves the institution's cut yet.
  earnedByInstitution: NOT_AVAILABLE,
  dateCreated: formatDate(spoil.created_at),
  status: spoil.status === 1 ? "Active" : "Unpublished",
  category: spoil.category?.name || NOT_AVAILABLE,
  courseCode: spoil.course_code || NOT_AVAILABLE,
  modules: spoil.modules_no,
  lessons: spoil.lessons_no,
  description: spoil.description || NOT_AVAILABLE,
  whatTheyWillLearn: splitLearningOutcomes(spoil.what_to_learn),
});

const ENROLLMENT_STATUSES: Record<string, EnrollmentStatus> = {
  ongoing: "Ongoing",
  completed: "Completed",
  not_started: "Not Started",
};

// Falls back to the completion percentage when there's no status; null when
// there's neither.
export const toEnrollmentStatus = (
  status?: string | null,
  percentage?: number | null,
): EnrollmentStatus | null => {
  if (status && ENROLLMENT_STATUSES[status]) return ENROLLMENT_STATUSES[status];
  if (percentage == null) return null;
  if (percentage >= 100) return "Completed";
  return percentage > 0 ? "Ongoing" : "Not Started";
};

export type StudentRow = EnrolledStudent & { learnerId: number };

export const toStudentRow = (item: EnrolledLearner): StudentRow => {
  const person = item.learner ?? item.user;
  return {
    id: String(item.id),
    learnerId: person?.id ?? item.user_id ?? item.id,
    name: `${person?.first_name ?? ""} ${person?.last_name ?? ""}`.trim() || NOT_AVAILABLE,
    avatar: person?.avatar ?? null,
    username: person?.username || NOT_AVAILABLE,
    dateEnrolled: formatDate(item.created_at),
    status: toEnrollmentStatus(item.status, item.percentage_completed),
  };
};

const toScore = (score?: number | null) => (score == null ? null : String(score));

export const toStudentProgress = (row: StudentRow, data: LearnerProgressData): StudentProgressDetails => {
  const enrolledAt = data.date_enrolled ?? data.created_at;
  const percentage = data.percentage_completed ?? data.progress ?? null;

  return {
    ...row,
    dateEnrolled: enrolledAt ? formatDate(enrolledAt) : row.dateEnrolled,
    status: toEnrollmentStatus(data.status, percentage) ?? row.status,
    progress: percentage,
    overallModules: data.total_modules ?? data.modules_no ?? null,
    modulesCompleted: data.total_modules_completed ?? data.modules_completed ?? null,
    modulesPending: data.total_modules_pending ?? data.modules_pending ?? null,
    currentModule: data.current_module || null,
    currentLesson: data.current_lesson || null,
    preQuizScore: toScore(data.pre_spoil_quiz_score),
    postQuizScore: toScore(data.post_spoil_quiz_score),
    moduleBreakdown: (data.modules ?? []).map((module) => ({
      title: module.title,
      lessons: module.lessons_no ?? module.lessons_count ?? null,
      status: toEnrollmentStatus(module.status, module.percentage_completed),
    })),
  };
};

// Same type labels the tutor's transaction history uses.
const PAYMENT_TYPES: Record<string, { label: string; kind: TransactionKind }> = {
  purchase: { label: "Spoylz Purchase", kind: "purchase" },
  credit: { label: "Spoylz Purchase", kind: "purchase" },
  sponsored_spoil: { label: "Spoylz Sale", kind: "purchase" },
  withdrawal: { label: "Withdrawal", kind: "withdrawal" },
  debit: { label: "Withdrawal", kind: "withdrawal" },
  promotion: { label: "Spoylz Promotion", kind: "other" },
};

export const PAYMENT_STATUSES: Record<string, string> = {
  success: "Successful",
  successful: "Successful",
  paid: "Successful",
  completed: "Successful",
  pending: "Pending",
  failed: "Failed",
};

export const toTransaction = (payment: PaymentDatum, spoilTitles: Map<number, string>): Transaction => {
  const type = PAYMENT_TYPES[payment.type?.toLowerCase()];
  const status = payment.status?.toLowerCase();

  return {
    id: String(payment.id),
    kind: type?.kind ?? "other",
    transactionType: type?.label ?? (payment.type ? humanize(payment.type) : NOT_AVAILABLE),
    transactionId: payment.reference || NOT_AVAILABLE,
    amount: formatNaira(payment.amount) ?? NOT_AVAILABLE,
    date: formatDate(payment.created_at),
    time: formatTime(payment.created_at),
    status: PAYMENT_STATUSES[status] ?? (status ? humanize(status) : null),
    description: payment.description || NOT_AVAILABLE,
    studentName: payment.learner_name || NOT_AVAILABLE,
    spoylzTitle: (payment.spoil_id != null && spoilTitles.get(payment.spoil_id)) || NOT_AVAILABLE,
    spoylzCostFee: formatNaira(payment.net_amount) ?? NOT_AVAILABLE,
    administratorFee: formatNaira(payment.charge) ?? NOT_AVAILABLE,
    // Not on the payment record.
    certificateFee: NOT_AVAILABLE,
    vat: formatNaira(payment.tax_amount) ?? NOT_AVAILABLE,
    totalAmountPaid: formatNaira(payment.amount) ?? NOT_AVAILABLE,
    accountCredited: payment.account_credited || NOT_AVAILABLE,
  };
};
