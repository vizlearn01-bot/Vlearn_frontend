import React from 'react';
import { Clock, Award, BarChart } from 'lucide-react';

const quizzes = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    description: "Test your knowledge of derivatives and integrals",
    questions: 20,
    timeLimit: 30,
    difficulty: "Intermediate"
  },
  {
    id: 2,
    title: "Physics Mechanics",
    description: "Cover Newton's laws and motion",
    questions: 15,
    timeLimit: 25,
    difficulty: "Advanced"
  },
  {
    id: 3,
    title: "Chemical Reactions",
    description: "Balance equations and predict products",
    questions: 25,
    timeLimit: 35,
    difficulty: "Beginner"
  }
];

export default function Quizzes() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <div className="flex space-x-4">
          <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
          </select>
          <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
            <option>All Difficulties</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{quiz.timeLimit} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BarChart className="h-5 w-5 mr-2" />
                <span>{quiz.questions} questions</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="h-5 w-5 mr-2" />
                <span>{quiz.difficulty}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Start Quiz
              </button>
              <button className="flex-1 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50">
                Practice Mode
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}