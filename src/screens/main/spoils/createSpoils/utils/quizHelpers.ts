import api from "@spt/utils/apiClient";

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

export const createQuizAndQuestions = async (
  quiz: any,
  opts: { type: string; spoilId?: number | string; moduleId?: number | string; moduleRes?: any } = { type: "pre" }
) => {
  if (!quiz) return null;

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
  if (quiz.overview?.pass_mark) fd.append("pass_mark", String(quiz.overview.pass_mark));

  let questionsPayload: any[] = [];
  if (Array.isArray(quiz.questions) && quiz.questions.length > 0) {
    questionsPayload = quiz.questions.map((q: any) => {
      const questionType = q.type ?? "multiple_choice";
      let answerVal = q.answer ?? q.correctAnswer ?? "";

      if (!answerVal && Array.isArray(q.options)) {
        const found = (q.options as any[]).find((opt: any) => opt && (opt.isCorrect === true || opt.is_correct === true || opt.correct === true));
        if (found) answerVal = found.text ?? found.label ?? found;
      }

      const baseQuestion: any = {
        question: q.prompt ?? q.question ?? "",
        type: questionType,
        answer: answerVal ?? "",
      };

      if (questionType === "multiple_choice" && Array.isArray(q.options) && q.options.length > 0) {
        const optionsArray = (q.options as any[]).map((opt: any) => (opt && (opt.text ?? opt.label ?? opt)) ?? opt);
        return { ...baseQuestion, options: optionsArray };
      }

      return baseQuestion;
    });
  }

  try {
    const quizRes = await api.post("/quiz", fd, { headers: { "Content-Type": "multipart/form-data" } });
    const createdQuizId = quizRes?.data?.id ?? quizRes?.data?.quiz?.id ?? quizRes?.data?.data?.id ?? null;
    // eslint-disable-next-line no-console
    console.log(`Created quiz (${opts.type}) id:`, createdQuizId, "questions:", questionsPayload, "raw:", quizRes?.data ?? quizRes);

    let questionsRes = null;
    if (createdQuizId && questionsPayload.length > 0) {
      questionsRes = await postQuestionsForQuiz(createdQuizId, questionsPayload, opts.type);
    }

    return { quizRes, questionsRes };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create quiz (${opts.type})`, err);
    throw err;
  }
};

export default {
  postQuestionsForQuiz,
  createQuizAndQuestions,
};
