import React, { useEffect } from 'react'
import { BookOpen, Trophy, Clock, Calendar, GraduationCap, BarChart, BookMarked, AlignCenterVertical as Certificate } from 'lucide-react';

function User() {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(URL);
        console.log(response.data);
        // setCategories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  const user = {
    name: "Sarah Anderson",
    role: "Student",
    email: "sarah.anderson@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    enrolledCourses: 6,
    completedCourses: 4,
    averageScore: 92,
    totalHours: 48,
    currentCourses: [
      {
        name: "Advanced React Patterns",
        progress: 75,
        lastAccessed: "2024-03-10"
      },
      {
        name: "TypeScript Fundamentals",
        progress: 45,
        lastAccessed: "2024-03-12"
      }
    ],
    achievements: [
      {
        name: "Quick Learner",
        description: "Completed 3 courses in one month",
        date: "2024-02-15"
      },
      {
        name: "Perfect Score",
        description: "100% on React Basics final exam",
        date: "2024-01-20"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-custom-blue h-48"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="bg-white rounded-lg shadow">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2 flex items-center justify-center sm:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:p-8 border-b border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.enrolledCourses}</p>
              <p className="text-sm text-gray-500">Enrolled Courses</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mx-auto">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.completedCourses}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mx-auto">
                <BarChart className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.averageScore}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mx-auto">
                <Clock className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.totalHours}</p>
              <p className="text-sm text-gray-500">Learning Hours</p>
            </div>
          </div>

          {/* Current Courses */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Courses</h2>
            <div className="space-y-4">
              {user.currentCourses.map((course, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BookMarked className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-medium text-gray-900">{course.name}</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      Last accessed: {course.lastAccessed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-custom-orange h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-right text-sm text-gray-500">
                    {course.progress}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600">
                      <Certificate className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default User
