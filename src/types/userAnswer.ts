export interface SubmitAnswerRequest {
  questionId: number;
  answerId: number;
}
export interface ResultAnswer {
  isCorrect: boolean;
}

export interface DoneQuestionCount {
  total: number;
  correct: number;
}

export interface SubmitAnswerResponse {
  statusCode: number;
  data: ResultAnswer;
}

export interface DoneQuestionCountResponse {
  statusCode: number;
  data: DoneQuestionCount;
}
