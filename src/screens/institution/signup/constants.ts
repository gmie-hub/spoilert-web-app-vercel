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

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
].map((state) => ({ value: state, label: state }));

export const INSTITUTION_POSITIONS = [
  { value: "owner", label: "Owner / Proprietor" },
  { value: "administrator", label: "Administrator" },
  { value: "registrar", label: "Registrar" },
  { value: "principal", label: "Principal / Head Teacher" },
  { value: "dean", label: "Dean" },
  { value: "hod", label: "Head of Department" },
  { value: "it_officer", label: "IT Officer" },
  { value: "other", label: "Other" },
];

export type SignupStep = "institution" | "contact" | "review" | "success";

export const SIGNUP_STEPS: SignupStep[] = [
  "institution",
  "contact",
  "review",
  "success",
];

export const STEPPER_LABELS: Record<Exclude<SignupStep, "success">, string> =
  {
    institution: "Institution Info",
    contact: "Contact Info",
    review: "Review",
  };
