import type {
  DoneQuestionCountResponse,
  SubmitAnswerResponse,
} from "../types/userAnswer";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/";

// Gửi đáp án người dùng (submit answer)
export async function submitAnswer(
  token: string,
  questionId: number,
  answerId: number
): Promise<boolean> {
  const response = await fetch(`${API_BASE}user-answers/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questionId, answerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit answer");
  }
  const data: SubmitAnswerResponse = await response.json();
  if (data.statusCode !== 200) {
    throw new Error("Submit answer failed");
  }
  return data.data.isCorrect;
}

// Lấy số câu đã làm và số câu đúng
export async function getDoneQuestionCount(
  token: string
): Promise<{ total: number; correct: number }> {
  const response = await fetch(`${API_BASE}user-answers/count-done-question`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch done question count");
  }

  const data: DoneQuestionCountResponse = await response.json();
  if (data.statusCode !== 200) {
    throw new Error("Get done question count failed");
  }
  console.log("Done question count data:", data.data);
  return data.data;
}

// Lấy số câu trả lời đúng thành công (nếu cần dùng riêng)
export async function getSuccessQuestionCount(
  token: string
): Promise<{ total: number; correct: number }> {
  const response = await fetch(
    `${API_BASE}user-answers/count-success-question`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch success question count");
  }

  const data: DoneQuestionCountResponse = await response.json();
  if (data.statusCode !== 200) {
    throw new Error("Get success question count failed");
  }
  return data.data;
}
