import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';
import Swal from 'sweetalert2';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useUserContext } from '../Context/UserContext';

function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { token } = useUserContext();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Start the quiz attempt
  useEffect(() => {
    const startAttempt = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/attempts/start/`,
          { quiz_id: quizId },
          {
            headers: { Authorization: `Bearer ${token.access}` },
          }
        );
        setAttempt(response.data);
        
        // Fetch quiz questions
        const quizResponse = await axios.get(
          `${BASE_URL}/quizzes/${quizId}/`,
          {
            headers: { Authorization: `Bearer ${token.access}` },
          }
        );
        setQuestions(quizResponse.data.questions);
        setTimeLeft(quizResponse.data.time_limit * 60); // Convert minutes to seconds
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    startAttempt();
  }, [quizId, token]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return;

    try {
      // Save the current answer
      await axios.post(
        `${BASE_URL}/answers/`,
        {
          attempt_id: attempt.id,
          question_id: questions[currentQuestionIndex].id,
          answer_id: selectedAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token.access}` },
        }
      );

      // Move to next question or submit if last question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        handleSubmit();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      // Submit the attempt
      const response = await axios.put(
        `${BASE_URL}/attempts/${attempt.id}/submit/`,
        {},
        {
          headers: { Authorization: `Bearer ${token.access}` },
        }
      );

      // Show result
      Swal.fire({
        title: 'Quiz Submitted!',
        html: `
          <div class="text-center">
            <h3 class="text-2xl font-bold mb-4">Your Score: ${response.data.score.toFixed(1)}%</h3>
            <p class="text-gray-600">You answered ${response.data.student_answers.filter(a => a.is_correct).length} out of ${questions.length} questions correctly</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View Results',
        customClass: {
          popup: 'rounded-3xl shadow-2xl p-10'
        }
      }).then(() => {
        navigate('/dashboard/results');
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div className="text-center py-20">Loading quiz...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!attempt || !questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        {/* Quiz header with timer */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{attempt.quiz.title}</h2>
          <div className="flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-full">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-custom-blue h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Current question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>
          
          {currentQuestion.image && (
            <div className="mb-6">
              <img 
                src={`${CLOUDINARY_BASE_URL}${currentQuestion.image}`} 
                alt="Question illustration" 
                className="max-h-64 mx-auto rounded-lg"
              />
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => (
              <div
                key={answer.id}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedAnswer === answer.id
                    ? 'border-custom-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <div className="flex items-center">
                  {selectedAnswer === answer.id ? (
                    <CheckCircle className="h-5 w-5 text-custom-blue mr-3" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3"></div>
                  )}
                  <span>{answer.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {currentQuestionIndex > 0 && (
            <button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300"
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedAnswer(null);
              }}
            >
              Previous
            </button>
          )}
          
          <button
            className={`ml-auto px-6 py-2 rounded-full ${
              selectedAnswer
                ? 'bg-custom-blue text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;