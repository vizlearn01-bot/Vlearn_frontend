import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';
import BASE_URL from '../config';
import { Trophy, Clock, Calendar, BarChart, CheckCircle, XCircle } from 'lucide-react';

function Results() {
  const { token } = useContext(UserContext);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/attempts/`, {
          headers: { Authorization: `Bearer ${token.access}` },
        });
        setAttempts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [token]);

  if (loading) return <div className="text-center py-20">Loading results...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Quiz Results</h1>
      
      {attempts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <p className="text-gray-500">You haven't completed any quizzes yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{attempt.quiz.title}</h2>
                  <p className="text-gray-600">{attempt.quiz.description}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    attempt.score >= 70 ? 'bg-green-100 text-green-800' : 
                    attempt.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    <Trophy className="h-4 w-4 mr-1" />
                    Score: {attempt.score.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(attempt.start_time).toLocaleDateString()} at{' '}
                    {new Date(attempt.start_time).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>
                    {attempt.end_time
                      ? `${Math.round(
                          (new Date(attempt.end_time) - new Date(attempt.start_time)
                        ) / 60000
                      )} minutes`
                      : 'Not completed'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BarChart className="h-5 w-5 mr-2" />
                  <span>
                    {attempt.student_answers.filter(a => a.is_correct).length} /{' '}
                    {attempt.student_answers.length} correct
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Question Breakdown:</h3>
                {attempt.student_answers.map((answer, idx) => (
                  <div key={idx} className="border-l-4 pl-4 ${
                    answer.is_correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  } p-3 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{answer.question.text}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your answer: {answer.answer ? answer.answer.text : answer.text_answer}
                        </p>
                      </div>
                      {answer.is_correct ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!answer.is_correct && answer.question.explanation && (
                      <div className="mt-2 text-sm bg-white p-2 rounded">
                        <p className="font-medium">Explanation:</p>
                        <p>{answer.question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;