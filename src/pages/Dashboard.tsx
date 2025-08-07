import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
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
  const menuRef = useRef<HTMLDivElement>(null);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionData | null>(null);
  const [isFinished, setIsFinished] = useState(false); // ✅ thêm state

  const [correctCount, setCorrectCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalquestionCount, setTotalQuestionCount] = useState(0);
  const token = localStorage.getItem("accessToken") || "";

  const loadRandomQuestion = async () => {
    setCurrentQuestion(null);
    try {
      const question = await fetchRandomQuestion(token);
      setCurrentQuestion(question);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setTranslate(false);
      setNewQuestion(null);
      setIsFinished(false);
    } catch (error) {
      console.error("Failed to load question", error);
      if (questionCount >= totalquestionCount) {
        setIsFinished(true); 
      }
    }
  };

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

  const handleNext = async () => {
    await loadRandomQuestion();
    await loadStats();
  };

  const handleTranslate = async () => {
    if (!currentQuestion) return;
    if (translate === false || newQuestion === null) {
      try {
        const translatedQuestion = await translateQuestion(token, currentQuestion);
        setNewQuestion(currentQuestion);
        setCurrentQuestion(translatedQuestion);
        setTranslate(true);
      } catch (error) {
        console.error("Failed to translate question", error);
      }
    } else {
      const temp = newQuestion;
      setNewQuestion(currentQuestion);
      setCurrentQuestion(temp);
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 flex min-h-[80vh]">
        {/* 2/3 Questions */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6 mr-4">
          {isFinished ? (
            <div className="text-center text-xl font-semibold text-green-600">
              🎉 Bạn đã hoàn thành toàn bộ câu hỏi!
            </div>
          ) : currentQuestion ? (
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
