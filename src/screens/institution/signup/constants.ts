export const INSTITUTION_TYPES = [
  { value: "university", label: "University" },
  { value: "polytechnic", label: "Polytechnic" },
  { value: "college", label: "College" },
  { value: "secondary_school", label: "Secondary School" },
  { value: "training_institute", label: "Training Institute" },
  { value: "other", label: "Other" },
];

export const INSTITUTION_COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "UG", label: "Uganda" },
  { value: "TZ", label: "Tanzania" },
  { value: "RW", label: "Rwanda" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
];

export type SignupStep =
  | "account"
  | "institution"
  | "details"
  | "verify"
  | "workspace"
  | "success";

export const SIGNUP_STEPS: SignupStep[] = [
  "account",
  "institution",
  "details",
  "verify",
  "workspace",
  "success",
];

export const STEP_COPY: Record<
  Exclude<SignupStep, "success">,
  { title: string; subtitle: string; button: string }
> = {
  account: {
    title: "Create Account",
    subtitle: "Fill the form below to get started.",
    button: "Next",
  },
  institution: {
    title: "Let's get to know you.",
    subtitle: "Tell us about your institution.",
    button: "Next",
  },
  details: {
    title: "Add Details.",
    subtitle: "Help us understand your institution's needs.",
    button: "Next",
  },
  verify: {
    title: "Verify Email.",
    subtitle:
      "We have sent a verification code to your email address. Please enter it below.",
    button: "Verify",
  },
  workspace: {
    title: "Almost there.",
    subtitle: "Set up your workspace name.",
    button: "Complete",
  },
};
