import React from 'react';
import { BookOpen, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    description: "Covers calculus, linear algebra, and differential equations",
    progress: 65,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Physics Fundamentals",
    description: "Learn mechanics, thermodynamics, and wave motion",
    progress: 30,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Chemistry Lab",
    description: "Hands-on experiments and chemical reactions",
    progress: 85,
    image: "https://images.unsplash.com/photo-1532634993-15f421e42ec0?auto=format&fit=crop&q=80&w=800",
  }
];

export default function Courses() {
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <Link to="/dashboard/home">
        <button className="bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange">
          Browse All Courses
        </button></Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl shadow-md overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>8 weeks</span>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 mr-1" fill="currentColor" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-3xl text-custom-blue bg-gray-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-custom-blue">
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${course.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-custom-blue"
                  ></div>
                </div>
              </div>

              <button className="w-full bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange">
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}