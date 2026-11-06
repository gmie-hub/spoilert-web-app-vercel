export const INSTITUTION_HOME = "/institution/dashboard";

export const isInstitutionRole = (role: unknown) =>
  String(role ?? "").toLowerCase() === "institution";

// Learner/creator areas an institution account can't use — institutions work
// from their dashboard instead. Sub-routes are covered too.
const LEARNER_ONLY_PREFIXES = [
  "/my-learnings",
  "/learnings",
  "/create-spoils",
  "/spoils/create-quiz",
  "/community",
];

export const isLearnerOnlyPath = (pathname: string | null) =>
  !!pathname &&
  LEARNER_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
