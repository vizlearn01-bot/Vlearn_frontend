import React, { useEffect, useState, useContext } from 'react';
import { BookOpen, Trophy, Clock, Calendar, GraduationCap, BarChart, AlignCenterVertical as Certificate } from 'lucide-react';
import BASE_URL from '../config';
import axios from 'axios';
import UserContext from '../Context/UserContext';
import { useNavigate } from "react-router";
import { useSubscriptionContext } from '../component-library/billing-and-payments/subscriptions/SubscriptionContextProvider';


// Define your Cloudinary base URL
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dfycvaiv7/';

function User() {
  const { user: contextUser, token } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [subscription, setSubscription] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token?.access) {
        navigate('/login');
        return;
      }

      try {
        const [profileResponse, subscriptionResponse] = await Promise.all([
          axios.get(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token.access}` },
          }),
          axios.get(`${BASE_URL}/subscriptions`, {
            headers: { Authorization: `Bearer ${token.access}` },
          })
        ]);

        setUser(profileResponse.data);
        setSubscription(subscriptionResponse.data.is_active);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
        setSubscriptionLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token?.access) return;

      try {
        const response = await axios.get(`${BASE_URL}/video_interactions`, {
          headers: { Authorization: `Bearer ${token.access}` },
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching user analytics', error);
        setError('Failed to fetch user analytics.');
      }
    };

    fetchAnalytics();
  }, [token]);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      if (!token?.access) return;

      try {
        const response = await axios.get(`${BASE_URL}/attempts/`, {
          headers: { Authorization: `Bearer ${token.access}` },
        });
        setQuizAttempts(response.data);
      } catch (err) {
        setQuizError(err.response?.data?.error || err.message);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuizAttempts();
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">No user data available.</div>;
  }

  const avatarUrl = `${CLOUDINARY_BASE_URL}${user.profile.avatar}`;

  const handleSubscription = (e) => {
    e.preventDefault();
    navigate("/billing-and-payments");
  }
  const subscriptionContext = useSubscriptionContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-custom-blue h-48"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="bg-white rounded-3xl shadow-2xl">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center">
              {/* <img
                src={avatarUrl}
                alt={user.username}
                className="w-24 h-24 rounded-full border-2 object-cover border-custom-orange shadow-lg"
              /> */}
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-500">{user.profile.phone_number}</p>

                <div className="mt-2 flex items-center justify-center sm:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Student
                  </span>
                </div>
                {subscriptionContext?.activeSubscriptions?.length > 0 ? (
                  <button className='bg-custom-orange mt-4 py-2 px-4 rounded-3xl text-white'>
                    Active subscription
                  </button>
                ) : (
                  <button
                    className='bg-custom-orange mt-4 py-2 px-4 rounded-3xl text-white'
                    onClick={handleSubscription}
                  >
                    Renew subscription
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:p-8 border-b border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.profile.enrolled_courses}</p>
              <p className="text-sm text-gray-500">Enrolled Courses</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mx-auto">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.profile.completed_courses}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mx-auto">
                <BarChart className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{user.profile.average_score}</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mx-auto">
                <Clock className="h-6 w-6" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{analytics.watched_duration}</p>
              <p className="text-sm text-gray-500">Learning Hours</p>
            </div>
          </div> */}

          {/* Quiz Results Section */}
        </div>
        <div className="p-6 sm:p-8 border-b border-gray-200 mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Quiz Results</h2>
          {quizLoading ? (
            <div className="text-center py-4">Loading quiz results...</div>
          ) : quizError ? (
            <div className="text-center py-4 text-red-500">Error: {quizError}</div>
          ) : quizAttempts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500">You haven't completed any quizzes yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizAttempts
                .sort((a, b) => new Date(b.end_time) - new Date(a.end_time)) // Sort by most recent first
                .slice(0, 3).map((attempt) => (
                  <div key={attempt.id} className="bg-gray-200 rounded-3xl p-4 hover:bg-gray-300 transition-colors hover:cursor-pointer">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{attempt.quiz.title}</h3>
                      </div>

                      <div className={`mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm ${attempt.score >= 70 ? 'bg-green-100 text-green-800' :
                        attempt.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        <Trophy className="h-4 w-4 mr-1" />
                        {attempt.score}%
                      </div>

                    </div>
                    <div className='flex items-center'>
                      <p className=" text-sm text-gray-900">{attempt.quiz.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                      {/* <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(attempt.end_time).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {Math.round((new Date(attempt.end_time) - new Date(attempt.start_time)) / 60000)} minutes
                        </span>
                      </div> */}
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 mr-1" />
                        <span>
                          {attempt.student_answers.filter(a => a.is_correct).length} /{' '}
                          {attempt.student_answers.length} correct
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {quizAttempts.length > 3 && (
                <button
                  onClick={() => navigate('/dashboard/results')}
                  className="text-custom-blue text-sm font-medium hover:underline mt-4"
                >
                  View all quiz results →
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default User;