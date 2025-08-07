import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import type { QuestionData } from "../types/question";
import {
  fetchRandomQuestion,
  translateQuestion,
} from "../api/questionApi";
import {
  submitAnswer,
  getDoneQuestionCount,
  getSuccessQuestionCount,
} from "../api/userAnswerApi";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  // State quản lý câu hỏi và đáp án
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionData | null>(null);

  // Thống kê câu hỏi
  const [correctCount, setCorrectCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalquestionCount, setTotalQuestionCount] = useState(0);
  const token = localStorage.getItem("accessToken") || "";

  // Load câu hỏi random
  const loadRandomQuestion = async () => {
    try {
      const question = await fetchRandomQuestion(token);
      setCurrentQuestion(question);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setTranslate(false);
      setNewQuestion(null);
    } catch (error) {
      console.error("Failed to load question", error);
      // Xử lý logout hoặc báo lỗi nếu cần
    }
  };

  // Load thống kê số câu đã làm & đúng
  const loadStats = async () => {
    try {
      const data = await getDoneQuestionCount(token);
      const dataSuccess = await getSuccessQuestionCount(token);
      setQuestionCount(data.total);
      setCorrectCount(dataSuccess.total);
      setTotalQuestionCount(data.correct);
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  };

  useEffect(() => {
    loadRandomQuestion();
    loadStats();
  }, []);

  // Xác nhận đáp án
  const handleConfirm = async () => {
    if (selectedOption === null || !currentQuestion) return;
    try {
      const selectedAnswerId = currentQuestion.answers[selectedOption].id;
      const correct = await submitAnswer(token, currentQuestion.id, selectedAnswerId);
      setIsCorrect(correct);
      setIsAnswered(true);
      
      await loadStats();
    } catch (error) {
      console.error("Failed to submit answer", error);
    }
  };

  // Câu hỏi tiếp theo
  const handleNext = async () => {
    await loadRandomQuestion();
    await loadStats();
  };

  // Dịch câu hỏi
  const handleTranslate = async () => {
    if (!currentQuestion) return;
    if(translate === false || newQuestion === null) {
      try {
        const translatedQuestion = await translateQuestion(token, currentQuestion);
        setNewQuestion(currentQuestion);
        setCurrentQuestion(translatedQuestion);
        setTranslate(true);
      } catch (error) {
        console.error("Failed to translate question", error);
      }
    }else{
      const temp = newQuestion;
      setNewQuestion(currentQuestion);
      setCurrentQuestion(temp);
    }
  };

  const handleLogout = async () => {
    await new Promise((resolve) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      resolve(null);
    });
    window.location.href = "/dashboard";
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Content */}
      <main className="max-w-5xl mx-auto p-6 flex min-h-[80vh]">
        {/* 2/3 Questions */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6 mr-4">
          {currentQuestion ? (
            <>
              <h2 className="text-xl font-bold mb-4">
                Câu hỏi: {currentQuestion.content}
              </h2>
              <div className="space-y-2">
                {currentQuestion.answers.map((ans, index) => (
                  <div
                    key={ans.id}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedOption === index
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => !isAnswered && setSelectedOption(index)}
                  >
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {ans.content}
                  </div>
                ))}
              </div>

              {!isAnswered ? (
                <button
                  onClick={handleConfirm}
                  disabled={selectedOption === null}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Xác nhận
                </button>
              ) : (
                <div className="mt-6">
                  <p
                    className={`text-lg font-semibold ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? "✅ Chính xác!" : "❌ Sai rồi!"}
                  </p>
                  <button
                    onClick={handleNext}
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 mr-3"
                  >
                    Tiếp tục
                  </button>
                  <button
                    onClick={handleTranslate}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Dịch câu hỏi
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Đang tải câu hỏi...</p>
          )}
        </div>

        {/* 1/3 Stats */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-4">📊 Thống kê</h2>
          <ul className="space-y-2 text-gray-700 text-lg">
            <li>
              ✅ Số câu đúng: <strong>{correctCount}</strong>
            </li>
            <li>
              📌 Số câu đã làm: <strong>{questionCount}</strong>
            </li>
            {/* Tổng số câu bạn có thể lấy từ backend nếu có API tương ứng */}
            <li>
              🧾 Tổng số câu: <strong>{totalquestionCount}</strong>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
