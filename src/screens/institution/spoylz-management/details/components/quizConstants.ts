export type QuizSection = "Pre-Spoylz Quiz" | "Post-Spoylz Quiz" | "Module Quiz";

export type QuizQuestion =
  | {
      type: "multiple-choice";
      question: string;
      options: string[];
      correctAnswer: string;
    }
  | {
      type: "fill-in-blank";
      question: string;
      correctAnswer: string;
    };

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    type: "multiple-choice",
    question: "Javascript is a backend language",
    options: ["True", "False"],
    correctAnswer: "False",
  },
  {
    type: "fill-in-blank",
    question: "What is the full meaning of UI/UX Design?",
    correctAnswer: "User interface design and user experience design",
  },
  {
    type: "multiple-choice",
    question: "CSS stands for Cascading Style Sheets",
    options: ["True", "False"],
    correctAnswer: "True",
  },
  {
    type: "multiple-choice",
    question: "React is a backend framework",
    options: ["True", "False"],
    correctAnswer: "False",
  },
  {
    type: "fill-in-blank",
    question: "What does the acronym 'DOM' stand for?",
    correctAnswer: "Document Object Model",
  },
  {
    type: "multiple-choice",
    question: "Flexbox is used for one-dimensional layouts",
    options: ["True", "False"],
    correctAnswer: "True",
  },
  {
    type: "multiple-choice",
    question: "Vue.js is a JavaScript framework",
    options: ["True", "False"],
    correctAnswer: "True",
  },
  {
    type: "fill-in-blank",
    question: "Which CSS property is used to change text color?",
    correctAnswer: "color",
  },
  {
    type: "multiple-choice",
    question: "HTML5 introduced semantic elements like <header> and <footer>",
    options: ["True", "False"],
    correctAnswer: "True",
  },
  {
    type: "fill-in-blank",
    question: "What does 'responsive design' mean?",
    correctAnswer: "Design that adapts to different screen sizes",
  },
];

export const QUIZ_SECTION_CONFIG: Record<
  QuizSection,
  { intro: string; totalQuestions: number; multipleChoice: number; fillInBlank: number; minutes: number; passScore: number }
> = {
  "Pre-Spoylz Quiz": {
    intro:
      "Test your baseline knowledge of frontend development before you begin this Spoylz! Covering essential topics such as HTML, CSS, JavaScript, responsive design, and modern frontend frameworks like React and Vue.js.",
    totalQuestions: 10,
    multipleChoice: 6,
    fillInBlank: 4,
    minutes: 50,
    passScore: 80,
  },
  "Post-Spoylz Quiz": {
    intro:
      "Test your knowledge of frontend development with this interactive quiz! Covering essential topics such as HTML, CSS, JavaScript, responsive design, and modern frontend frameworks like React and Vue.js.",
    totalQuestions: 10,
    multipleChoice: 6,
    fillInBlank: 4,
    minutes: 50,
    passScore: 80,
  },
  "Module Quiz": {
    intro:
      "Test your understanding of this module's key concepts with this short interactive quiz covering what you've just learned.",
    totalQuestions: 5,
    multipleChoice: 3,
    fillInBlank: 2,
    minutes: 15,
    passScore: 70,
  },
};
