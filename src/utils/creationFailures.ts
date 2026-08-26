// Publishing a Spoylz is a chain of separate API calls: the spoil, then each
// module, its lessons, the quizzes and their questions. Any one of them can
// fail on its own, so every step reports a failure describing what broke and
// how to run just that step again — no earlier step is repeated, so retrying
// never duplicates something that already saved.

export type CreationFailureKind =
  | "module"
  | "lessons"
  | "quiz"
  | "questions"
  | "certificate";

export interface CreationFailure {
  /** Stable per step, so a repeated failure replaces its earlier entry. */
  id: string;
  kind: CreationFailureKind;
  /** What failed, e.g. `Lessons for "Module 1"`. */
  label: string;
  /** CTA copy, e.g. "Recreate Lessons". */
  actionLabel: string;
  /** Why it failed, taken from the API response where possible. */
  message: string;
  /** Runs this step — and only this step — again. */
  retry: () => Promise<unknown>;
}

export type ReportCreationFailure = (failure: CreationFailure) => void;

export const getApiErrorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;
