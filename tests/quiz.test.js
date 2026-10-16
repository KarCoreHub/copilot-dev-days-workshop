// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  createQuiz,
  answerQuestion,
  advanceQuiz,
  isQuizFinished,
  calculatePercentage,
  formatTimeLeft,
  getGrade,
  getFeedbackMessage,
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("createQuiz creates an initial state with a copy of the questions", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);
  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notEqual(state.questions, questions);
});

test("answerQuestion increments the score for a correct answer without mutating state", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);
  assert.deepEqual(result, {
    state: { ...state, score: 1 },
    correct: true,
  });
  assert.equal(state.score, 0);
});

test("answerQuestion preserves the score for an incorrect answer", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 2 };
  const result = answerQuestion(state, 0);
  assert.deepEqual(result, { state, correct: false });
  assert.notEqual(result.state, state);
});

test("advanceQuiz increments the current question without mutating state", () => {
  const state = createQuiz([{ answer: 0 }, { answer: 1 }]);
  const nextState = advanceQuiz(state);
  assert.deepEqual(nextState, { ...state, current: 1 });
  assert.equal(state.current, 0);
});

test("isQuizFinished returns false before the final question", () => {
  assert.equal(isQuizFinished(createQuiz([{ answer: 0 }])), false);
});

test("isQuizFinished returns true after the final question", () => {
  assert.equal(isQuizFinished({ questions: [{ answer: 0 }], current: 1, score: 0 }), true);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("formatTimeLeft formats remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats zero seconds", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns the A message for an A grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
});

test("getFeedbackMessage returns the B message for a B grade", () => {
  assert.equal(getFeedbackMessage("B"), "Good job!");
});

test("getFeedbackMessage returns the C message for a C grade", () => {
  assert.equal(getFeedbackMessage("C"), "Not bad!");
});

test("getFeedbackMessage returns the default message for an unknown grade", () => {
  assert.equal(getFeedbackMessage("D"), "Keep practicing");
});
