import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserAnswerHistory } from "../api/userAnswerApi";
import type { UserAnswerHistoryItem } from "../types/userAnswer";

const History: React.FC = () => {
  const [history, setHistory] = useState<UserAnswerHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUserAnswerHistory(token);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📚 Lịch sử làm bài</h1>
        {loading ? (
          <p>Đang tải lịch sử...</p>
        ) : history.length === 0 ? (
          <p>Bạn chưa làm câu hỏi nào.</p>
        ) : (
          <div className="space-y-6">
            {history.map((item, index) => (
              <div
                key={`${item.questionId}-${index}`}
                className="bg-white p-4 rounded shadow"
              >
                <h2 className="text-lg font-semibold mb-2">
                  {index + 1}. {item.questionContent}
                </h2>
                <ul className="space-y-2">
                  {item.answers.map((ans) => (
                    <li
                      key={ans.id}
                      className={`p-2 rounded border ${
                        ans.id === item.selectedAnswerId
                          ? item.isCorrect
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : ans.isCorrect
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + item.answers.indexOf(ans))}.
                      </span>
                      {ans.content}
                      {ans.id === item.selectedAnswerId && (
                        <span className="ml-2 font-semibold">
                          ({item.isCorrect ? "✅ Đúng" : "❌ Sai"})
                        </span>
                      )}
                      {!item.isCorrect &&
                        ans.isCorrect &&
                        ans.id !== item.selectedAnswerId && (
                          <span className="ml-2 text-green-700 italic">
                            (Đáp án đúng)
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
