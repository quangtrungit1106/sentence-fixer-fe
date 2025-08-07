export interface Answer {
  id: number;
  content: string;
}

export interface QuestionData {
  id: number;
  content: string;
  answers: Answer[];
}

export interface QuestionResponse {
  statusCode: number;
  data: QuestionData;
}

export interface CheckAnswerResponse {
  statusCode: number;
  data: {
    correct: boolean;
  };
}

export interface TranslateQuestionDto {
  id: number;
}
