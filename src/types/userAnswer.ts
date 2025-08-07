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

export interface UserAnswerHistoryItem {
  questionId: number;
  questionContent: string;
  answers: {
    id: number;
    content: string;
    isCorrect: boolean;
  }[];
  selectedAnswerId: number;
  selectedAnswerContent: string;
  isCorrect: boolean;
}
export interface UserAnswerHistoryResponse {
  statusCode: number;
  data: UserAnswerHistoryItem[];
}
