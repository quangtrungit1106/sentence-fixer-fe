import type { QuestionData, QuestionResponse } from "../types/question";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/";

// Lấy câu hỏi random, có token để xác thực
export async function fetchRandomQuestion(
  token: string
): Promise<QuestionData> {
  const res = await fetch(`${API_BASE}questions/random`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch random question");
  const json: QuestionResponse = await res.json();
  return json.data;
}

// Dịch câu hỏi (POST /questions/translate) với payload gồm id câu hỏi
export async function translateQuestion(
  token: string,
  question: QuestionData
): Promise<QuestionData> {
  const res = await fetch(`${API_BASE}questions/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error("Failed to translate question");
  const json: QuestionResponse = await res.json();
  return json.data;
}
