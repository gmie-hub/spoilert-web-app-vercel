export interface OutlineLesson {
  id: string;
  title: string;
  type: "lesson" | "quiz";
}

export interface OutlineModule {
  id: string;
  moduleLabel: string;
  title: string;
  lessons: OutlineLesson[];
}

export const MOCK_COURSE_OUTLINE: OutlineModule[] = [
  {
    id: "1",
    moduleLabel: "Module 1",
    title: "Introduction To Design Principles",
    lessons: [
      { id: "1-1", title: "What are Design Principles?", type: "lesson" },
      { id: "1-2", title: "Understanding Visual Hierarchy", type: "lesson" },
      { id: "1-3", title: "The Principle of Balance", type: "lesson" },
      { id: "1-4", title: "Contrast and Emphasis in Design", type: "lesson" },
      { id: "1-5", title: "Applying Design Principles in Practice", type: "lesson" },
      { id: "1-6", title: "Quiz", type: "quiz" },
    ],
  },
  {
    id: "2",
    moduleLabel: "Module 2",
    title: "Typography Fundamentals",
    lessons: [
      { id: "2-1", title: "Choosing the Right Typeface", type: "lesson" },
      { id: "2-2", title: "Type Pairing and Hierarchy", type: "lesson" },
      { id: "2-3", title: "Quiz", type: "quiz" },
    ],
  },
  {
    id: "3",
    moduleLabel: "Module 3",
    title: "Color Theory in Design",
    lessons: [
      { id: "3-1", title: "The Color Wheel Explained", type: "lesson" },
      { id: "3-2", title: "Using Color to Evoke Emotion", type: "lesson" },
      { id: "3-3", title: "Quiz", type: "quiz" },
    ],
  },
  {
    id: "4",
    moduleLabel: "Module 4",
    title: "Layout and Composition",
    lessons: [
      { id: "4-1", title: "Grid Systems and Alignment", type: "lesson" },
      { id: "4-2", title: "Whitespace and Balance", type: "lesson" },
      { id: "4-3", title: "Quiz", type: "quiz" },
    ],
  },
  {
    id: "5",
    moduleLabel: "Module 5",
    title: "Wrap Up & Final Project",
    lessons: [
      { id: "5-1", title: "Bringing It All Together", type: "lesson" },
      { id: "5-2", title: "Quiz", type: "quiz" },
    ],
  },
];

export const OUTLINE_LESSON_DETAIL = {
  category: "UI/UX Design",
  lecturerName: "Ogunsola Omorinsola",
  description:
    "Understanding Design Principles\" is a comprehensive Spoylz that takes you through the foundational concepts of creating effective and visually appealing designs. Whether you're a beginner looking to step into the design world or a professional aiming to polish your skills, this Spoylz has something for everyone. You'll explore core design principles, including balance, contrast, hierarchy, and more, with real-world examples and actionable tips.",
  whatYouWillLearn: [
    "How to identify the core principles of design.",
    "Understanding balance, contrast, and hierarchy in design",
    "The role of typography in effective communication",
    "How to use color theory to evoke emotions.",
    "Designing user-friendly interfaces.",
  ],
};
