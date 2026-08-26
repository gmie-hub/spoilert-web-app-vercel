import api from "@spt/utils/apiClient";
import {
  type ReportCreationFailure,
  getApiErrorMessage,
} from "@spt/utils/creationFailures";

// Server-created questions come back with a plain numeric id; locally-added
// draft questions use a generated string id. This lets the edit flow tell
// which questions already exist on the server (patch) vs. which are new (create).
const isServerQuestionId = (id: any) => /^\d+$/.test(String(id));

// Normalize a local quiz question (prompt/options/answer) into the API payload
// shape shared by the create and edit endpoints.
export const buildQuestionPayload = (q: any) => {
  const questionType = q.type ?? "multiple_choice";
  let answerVal = q.answer ?? q.correctAnswer ?? "";

  if (!answerVal && Array.isArray(q.options)) {
    const found = (q.options as any[]).find(
      (opt: any) =>
        opt &&
        (opt.isCorrect === true || opt.is_correct === true || opt.correct === true),
    );
    if (found) answerVal = found.text ?? found.label ?? found;
  }

  const baseQuestion: any = {
    question: q.prompt ?? q.question ?? "",
    type: questionType,
    answer: answerVal ?? "",
  };

  if (
    questionType === "multiple_choice" &&
    Array.isArray(q.options) &&
    q.options.length > 0
  ) {
    const optionsArray = (q.options as any[]).map(
      (opt: any) => (opt && (opt.text ?? opt.label ?? opt)) ?? opt,
    );
    return { ...baseQuestion, options: optionsArray };
  }

  return baseQuestion;
};

export const postQuestionsForQuiz = async (
  createdQuizId: any,
  questionsPayload: any[],
  typeLabel = "quiz"
) => {
  if (!createdQuizId || !questionsPayload || questionsPayload.length === 0) return null;

  try {
    const questionsRes = await api.post("/questions", { quiz_id: createdQuizId, questions: questionsPayload });
    // eslint-disable-next-line no-console
    console.log(`Posted ${typeLabel} questions to /questions:`, questionsRes?.data ?? questionsRes);
    return questionsRes;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`Posting to /questions failed for ${typeLabel} quiz id ${createdQuizId}, trying fallback...`, err);
  }

  try {
    const altRes = await api.post(`/quiz/${createdQuizId}/questions`, { questions: questionsPayload });
    // eslint-disable-next-line no-console
    console.log(`Posted ${typeLabel} questions to /quiz/${createdQuizId}/questions:`, altRes?.data ?? altRes);
    return altRes;
  } catch (err2) {
    // eslint-disable-next-line no-console
    console.error(`Failed to post ${typeLabel} questions for quiz ${createdQuizId}`, err2);
    throw err2;
  }
};

const QUIZ_LABELS: Record<string, string> = {
  pre: "Pre-Spoylz quiz",
  post: "Post-Spoylz quiz",
  module: "Module quiz",
};

export const createQuizAndQuestions = async (
  quiz: any,
  opts: {
    type: string;
    spoilId?: number | string;
    moduleId?: number | string;
    moduleRes?: any;
    /** Overrides the generic quiz name in failure messages. */
    label?: string;
    onStepFailed?: ReportCreationFailure;
  } = { type: "pre" }
) => {
  if (!quiz) return null;

  const quizLabel = opts.label ?? QUIZ_LABELS[opts.type] ?? "Quiz";

  const fd = new FormData();
  if (quiz.title) fd.append("title", quiz.title);
  fd.append("type", opts.type);
  if (opts.spoilId !== undefined) fd.append("spoil_id", String(opts.spoilId));
  if (opts.moduleId !== undefined) fd.append("module_id", String(opts.moduleId));
  if (opts.moduleRes && (opts.moduleRes?.data?.spoil_id || opts.moduleRes?.data?.module?.spoil_id)) {
    fd.append("spoil_id", String(opts.moduleRes?.data?.spoil_id ?? opts.moduleRes?.data?.module?.spoil_id));
  }
  if (quiz.description) fd.append("description", quiz.description ?? "");

  const noOfQuestions = (quiz.overview?.numberOfQuestions && String(quiz.overview.numberOfQuestions)) || (Array.isArray(quiz.questions) ? String(quiz.questions.length) : "0");
  fd.append("no_of_questions", noOfQuestions);

  if (quiz.overview?.timeLimit) fd.append("time_limit", String(quiz.overview.timeLimit));

  // The overview form stores the pass mark as `passmark`; drafts and server
  // payloads use `pass_mark`. Accept either and always send `pass_mark`.
  const passMark =
    quiz.overview?.passmark ??
    quiz.overview?.pass_mark ??
    quiz.passmark ??
    quiz.pass_mark;
  if (passMark !== undefined && passMark !== null && passMark !== "") {
    fd.append("pass_mark", String(passMark));
  }

  let questionsPayload: any[] = [];
  if (Array.isArray(quiz.questions) && quiz.questions.length > 0) {
    questionsPayload = quiz.questions.map((q: any) => buildQuestionPayload(q));
  }

  let quizRes;
  let createdQuizId = null;

  try {
    quizRes = await api.post("/quiz", fd, { headers: { "Content-Type": "multipart/form-data" } });
    createdQuizId = quizRes?.data?.id ?? quizRes?.data?.quiz?.id ?? quizRes?.data?.data?.id ?? null;
    // eslint-disable-next-line no-console
    console.log(`Created quiz (${opts.type}) id:`, createdQuizId, "questions:", questionsPayload, "raw:", quizRes?.data ?? quizRes);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create quiz (${opts.type})`, err);
    // Nothing saved for this quiz, so the retry runs the whole step again.
    opts.onStepFailed?.({
      id: `quiz-${opts.type}-${opts.moduleId ?? opts.spoilId ?? "spoil"}`,
      kind: "quiz",
      label: quizLabel,
      actionLabel: "Recreate Quiz",
      message: getApiErrorMessage(err, "Failed to create this quiz"),
      retry: () => createQuizAndQuestions(quiz, opts),
    });
    throw err;
  }

  if (!createdQuizId || questionsPayload.length === 0) {
    return { quizRes, questionsRes: null };
  }

  try {
    const questionsRes = await postQuestionsForQuiz(createdQuizId, questionsPayload, opts.type);

    return { quizRes, questionsRes };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create questions for quiz (${opts.type})`, err);
    // The quiz itself saved — only its questions need posting again, so the
    // retry must not recreate the quiz.
    const savedQuizId = createdQuizId;

    opts.onStepFailed?.({
      id: `questions-${savedQuizId}`,
      kind: "questions",
      label: `${quizLabel} questions`,
      actionLabel: "Recreate Questions",
      message: getApiErrorMessage(err, "Failed to create these questions"),
      retry: () => postQuestionsForQuiz(savedQuizId, questionsPayload, opts.type),
    });

    return { quizRes, questionsRes: null };
  }
};

// Edit a single existing question. Sent as multipart FormData via POST to
// /questions/{questionId} (e.g. /questions/3) with `_method: patch` in the body
// so the backend treats the POST as an update (Laravel style).
export const updateQuestion = async (
  questionId: any,
  questionPayload: any,
  quizId?: any,
) => {
  const fd = new FormData();
  fd.append("_method", "patch");
  if (quizId !== undefined && quizId !== null) fd.append("quiz_id", String(quizId));
  fd.append("question", questionPayload?.question ?? "");
  fd.append("type", questionPayload?.type ?? "");
  fd.append("answer", questionPayload?.answer ?? "");
  if (Array.isArray(questionPayload?.options)) {
    questionPayload.options.forEach((opt: any, index: number) => {
      fd.append(`options[${index}]`, opt ?? "");
    });
  }

  const res = await api.post(`/questions/${questionId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // eslint-disable-next-line no-console
  console.log(`Patched question ${questionId}:`, res?.data ?? res);
  return res;
};

// Edit an existing quiz (used when the spoil is already saved on the server).
// The quiz payload mirrors the CREATE payload (title/type/spoil_id/module_id/
// description/no_of_questions/time_limit/pass_mark) and only adds `_method: patch`
// so POST /quiz/{id} is treated as an update. Every existing question is then
// patched and any newly-added ones are created.
export const updateQuizAndQuestions = async (
  quizId: any,
  overview: any,
  questions: any[],
  opts: {
    type: string;
    spoilId?: number | string;
    moduleId?: number | string;
  } = { type: "pre" }
) => {
  if (!quizId) return null;

  const fd = new FormData();
  fd.append("_method", "patch");
  if (overview?.title) fd.append("title", overview.title);
  fd.append("type", opts.type);
  if (opts.spoilId !== undefined && opts.spoilId !== null) {
    fd.append("spoil_id", String(opts.spoilId));
  }
  if (opts.moduleId !== undefined && opts.moduleId !== null) {
    fd.append("module_id", String(opts.moduleId));
  }
  if (overview?.description) fd.append("description", overview.description ?? "");

  const noOfQuestions =
    (overview?.numberOfQuestions && String(overview.numberOfQuestions)) ||
    (Array.isArray(questions) ? String(questions.length) : "0");
  fd.append("no_of_questions", noOfQuestions);

  if (overview?.timeLimit) fd.append("time_limit", String(overview.timeLimit));
  const passMark = overview?.passmark ?? overview?.pass_mark;
  if (passMark !== undefined && passMark !== "" && passMark !== null) {
    fd.append("pass_mark", String(passMark));
  }

  let quizRes;
  try {
    quizRes = await api.post(`/quiz/${quizId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // eslint-disable-next-line no-console
    console.log(`Patched quiz (${opts.type}) id ${quizId}:`, quizRes?.data ?? quizRes);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to update quiz (${opts.type}) id ${quizId}`, err);
    throw err;
  }

  const questionResults: any[] = [];
  const newQuestions: any[] = [];

  for (const q of Array.isArray(questions) ? questions : []) {
    const payload = buildQuestionPayload(q);
    if (isServerQuestionId(q?.id)) {
      const res = await updateQuestion(q.id, payload, quizId);
      questionResults.push(res);
    } else {
      // Questions added while editing don't exist server-side yet — create them.
      newQuestions.push(payload);
    }
  }

  let createdQuestionsRes = null;
  if (newQuestions.length > 0) {
    createdQuestionsRes = await postQuestionsForQuiz(quizId, newQuestions, opts.type);
  }

  return { quizRes, questionResults, createdQuestionsRes };
};

const quizHelpers = {
  buildQuestionPayload,
  postQuestionsForQuiz,
  createQuizAndQuestions,
  updateQuestion,
  updateQuizAndQuestions,
};

export default quizHelpers;
