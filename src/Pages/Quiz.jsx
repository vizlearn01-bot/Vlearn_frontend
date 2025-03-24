import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react';

// Sample quiz questions with their options and correct answers
const sampleQuestions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2 // Index of the correct answer in the options array
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    correctAnswer: 1
  }
];

function Quiz() {
  // State variables to manage the quiz
  const [currentQuestion, setCurrentQuestion] = useState(0); // Tracks the current question index
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Tracks the selected answer index
  const [score, setScore] = useState(0); // Tracks the user's score
  const [showResult, setShowResult] = useState(false); // Controls whether to show the result screen
  const [timeLeft, setTimeLeft] = useState(30); // Tracks the time left for the current question
  const [isAnswered, setIsAnswered] = useState(false); // Tracks if the current question has been answered

  // useEffect to handle the timer for each question
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      // Set up a timer that decrements the timeLeft every second
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      // If time runs out and the question is unanswered, move to the next question
      handleNextQuestion();
    }
  }, [timeLeft, isAnswered]); // Dependencies: re-run effect when timeLeft or isAnswered changes

  // Function to handle when an answer is selected
  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return; // If already answered, do nothing

    setSelectedAnswer(answerIndex); // Set the selected answer
    setIsAnswered(true); // Mark the question as answered

    // Check if the selected answer is correct and update the score
    if (answerIndex === sampleQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  // Function to move to the next question or show the result if it's the last question
  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      // Move to the next question
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null); // Reset selected answer
      setTimeLeft(30); // Reset timer
      setIsAnswered(false); // Reset answered state
    } else {
      // If it's the last question, show the result screen
      setShowResult(true);
    }
  };

  // Function to reset the quiz to its initial state
  const resetQuiz = () => {
    setCurrentQuestion(0); // Go back to the first question
    setSelectedAnswer(null); // Reset selected answer
    setScore(0); // Reset score
    setShowResult(false); // Hide result screen
    setTimeLeft(30); // Reset timer
    setIsAnswered(false); // Reset answered state
  };

  // Function to format the time left as "mm:ss"
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format as "mm:ss"
  };

  // Render the result screen if showResult is true
  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-custom-orange">Quiz Complete!</h2>
          <div className="text-center mb-8">
            <p className="text-xl mb-2">Your Score:</p>
            <p className="text-4xl font-bold text-custom-blue">{score} / {sampleQuestions.length}</p>
            <p className="mt-2">
              ({Math.round((score / sampleQuestions.length) * 100)}% correct)
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="w-full py-3 px-6 bg-custom-blue text-white rounded-3xl hover:bg-custom-orange transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render the quiz interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header with question number and timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1}/{sampleQuestions.length}
          </div>
          <div className="flex items-center gap-2 text-custom-blue">
            <Timer size={20} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question and answer options */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {sampleQuestions[currentQuestion].text}
          </h2>
          
          <div className="space-y-4">
            {sampleQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-full transition-all ${
                  selectedAnswer === index
                    ? isAnswered
                      ? index === sampleQuestions[currentQuestion].correctAnswer
                        ? 'bg-green-100 border-green-500' // Correct answer styling
                        : 'bg-red-100 border-red-600' // Incorrect answer styling
                      : 'bg-indigo-100 border-indigo-500' // Selected answer styling
                    : 'bg-gray-50 hover:bg-gray-100' // Default styling
                } ${
                  isAnswered && index === sampleQuestions[currentQuestion].correctAnswer
                    ? 'bg-green-100 border-green-500' // Correct answer styling
                    : ''
                } border-2 ${
                  isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {/* Show a checkmark or cross based on whether the answer is correct */}
                  {isAnswered && index === selectedAnswer && (
                    index === sampleQuestions[currentQuestion].correctAnswer 
                      ? <CheckCircle2 className="text-green-500" size={20} />
                      : <XCircle className="text-red-600" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer with score and next button */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            Score: {score}/{currentQuestion + 1}
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className={`py-3 px-6 rounded-3xl flex items-center gap-2 ${
              isAnswered
                ? 'bg-custom-blue text-white hover:bg-custom-orange' // Enabled button styling
                : 'bg-gray-200 text-gray-500 cursor-not-allowed' // Disabled button styling
            } transition-colors`}
          >
            {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
