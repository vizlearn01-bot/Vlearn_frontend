import React, { useState, useEffect } from 'react';
import { Clock, Award, BarChart } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../config';
import { Link } from 'react-router-dom';



function Quizzes() {

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/quizzes/`);
        setQuizzes(response.data);
        console.log(response.data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Ensure loading stops
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        {/* <div className="flex space-x-4">
        <select className="bg-white border border-gray-300 rounded-3xl px-4 py-2">
          <option>All Subjects</option>
          <option>Mathematics</option>
          <option>Physics</option>
          <option>Chemistry</option>
        </select>
        <select className="bg-white border border-gray-300 rounded-3xl px-4 py-2">
          <option>All Difficulties</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.video} className="bg-white rounded-3xl shadow-2xl p-6 w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-4">{quiz.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{quiz.time_limit} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BarChart className="h-5 w-5 mr-2" />
                <span>{quiz.question_count} questions</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="h-5 w-5 mr-2" />
                <span>{quiz.difficulty}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link to={`/dashboard/quiz/${quiz.video}`}>
                <button className="flex-1 bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange w-full">
                  Start Quiz
                </button>
              </Link>
              {/* <button className="flex-1 border border-custom-blue text-custom-blue px-4 py-2 rounded-3xl hover:bg-indigo-50">
              Practice Mode
            </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Quizzes