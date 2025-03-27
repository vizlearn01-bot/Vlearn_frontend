import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { GraduationCap, User, Clock, BookOpen, BarChart2, Award } from "lucide-react";
import UserContext from "../Context/UserContext";

function CourseDetail() {
  const { id } = useParams(); // Get the id from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { user, token } = useContext(UserContext);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const intervalRef = useRef(null);
  const [quiz, setQuiz] = useState([])

  // Fetch course details using the id from the URL
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses/${id}`);
        setCourse(response.data); // Set the course details
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/quizzes/`);
        // Find the quiz for this course (by matching quiz.video to course.id)
        const courseQuiz = response.data.find(q => q.video === parseInt(id));
        setQuiz(courseQuiz); // Set the single quiz object or null
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };
    fetchQuizzes();
  }, [id]);

  // Extract YouTube video ID from the URL
  const extractVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  // Extract the video ID if available
  const videoID = course?.video_link ? extractVideoID(course.video_link) : null;

  // Load the YouTube IFrame API script
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize the player after the script is loaded
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('ytplayer', {
        videoId: videoID,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videoID]);

  const onPlayerReady = (event) => {
    console.log('Player is ready');
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      console.log('Video started playing');
      startTracking();
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      console.log('Video paused');
      stopTracking();
      sendAnalytics(false); // Video paused but not completed
    } else if (event.data === window.YT.PlayerState.ENDED) {
      console.log('Video ended');
      stopTracking();
      sendAnalytics(true); // Video completed
    }
  };

  const startTracking = () => {
    intervalRef.current = setInterval(() => {
      setWatchedDuration((prev) => prev + 1); // Increment watched duration every second
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const sendAnalytics = (isCompleted) => {
    if (!course || !course.video_link) {
      console.error("Video URL is missing. Cannot send analytics.");
      return;
    }

    const payload = {
      video_url: course.video_link,
      watched_duration: watchedDuration,
      is_completed: isCompleted,
      user: user?.id,  // Ensure the user ID is included
    };

    axios
      .post(`${BASE_URL}/video_interactions/`, payload, {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      })
      .then((response) => {
        console.log("Analytics sent:", response.data);
        setWatchedDuration(0);
      })
      .catch((error) => {
        console.error("Error sending analytics:", error);
      });
  };

  if (loading) {
    return (
      <div className="p-8 mx-auto max-w-6xl flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin border-4 border-t-4 border-custom-blue border-solid rounded-full w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex flex-col">
        {/* Course Header */}
        <nav className="fixed w-full flex flex-col md:flex-row items-center justify-between p-2 shadow-2xl bg-white">
          {/* First Section: Logo and VizLearn Heading */}
          <div className="items-center gap-2 hidden md:flex p-4">
            <GraduationCap className="h-10 w-10 text-custom-blue" />
            <Link to="/dashboard">
              <h1 className="text-3xl font-bold text-gray-800">VizLearn</h1>
            </Link>
          </div>
          {/* Second Section: Course Title, Subtitle, and Student Count */}
          <div className="flex flex-col md:flex-row items-center  text-center mt-2 md:mt-0">
            <div>
              <h1 className="text-3xl font-bold text-custom-blue">{course?.title}</h1>
              <p className="mt-1 text-slate-600">Course subtitle: {course?.subtitle}</p>
            </div>
          </div>
          <div className="items-center text-slate-700 mt-6 md:mt-0 hidden md:flex mr-4 p-4">
            <User className="h-5 w-5 mr-" />
            {user ? (<span>{user.username}</span>) : (<User />)}
          </div>
        </nav>
        <div className="mt-28">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Video and Course Details */}
              <div className="col-span-1 lg:col-span-2">
                {/* Video Player */}
                <div className="rounded-3xl shadow-2xl overflow-hidden">
                  {videoID ? (
                    <div className="aspect-video w-full ">
                      <div id="ytplayer" className="w-full h-full rounded-t-xl"></div>
                    </div>
                  ) : (
                    course?.image && (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-64 object-cover rounded-t-xl"
                      />
                    )
                  )}
                </div>

                {/* Course Details */}
                <div className="rounded-3xl shadow-2xl p-6 mt-8">
                  <h2 className="text-2xl font-bold text-slate-900">{course.title}</h2>
                  <p className="text-slate-600 mt-2">{course.description}</p>
                  <p className="text-slate-500 mt-4">
                    Duration: <span className="font-semibold">{course.duration}</span>
                  </p>
                </div>

                {/* Progress Overview */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 my-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Hours Watched</p>
                        <p className="text-xl font-semibold text-slate-900">{course.hoursWatched}h</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Completed</p>
                        <p className="text-xl font-semibold text-slate-900">
                          {course.completed}/{course.totalLessons}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 rounded-lg p-3">
                        <BarChart2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Avg. Score</p>
                        <p className="text-xl font-semibold text-slate-900">{course.avgScore}%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 rounded-lg p-3">
                        <Award className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Progress</p>
                        <p className="text-xl font-semibold text-slate-900">{course.progress}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Additional Course Information */}
              <div className="col-span-1">
                <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">About the experiment</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Instructor</p>
                      <p className="text-lg font-semibold text-slate-900">{course.instructor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Category</p>
                      <p className="text-lg font-semibold text-slate-900">Chemistry{course.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Level</p>
                      <p className="text-lg font-semibold text-slate-900">Grade: 12{course.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Last Updated</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {new Date().toLocaleDateString()} {course.lastUpdated}
                      </p>
                    </div>
                  </div>
                </div>


                {/* Current Progress */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 ">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Section</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-slate-900 font-medium">{course.title}</p>
                        <span className="text-sm text-slate-500 ">{course.duration}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-custom-orange h-2 rounded-full mt-2"></div>
                      </div>
                    </div>
                    <div className="border-t border-slate-300 w-fit">
                      <p className="text-sm text-slate-500 mt-2">Next up:</p>
                      <p className="text-slate-900 font-medium">{course.title}</p>
                    </div>
                  </div>
                </div>
                {quiz && (
                  <Link to={`/dashboard/quiz/${quiz.id}`} className="block my-8 text-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 mt-10 text-center hover:shadow-3xl hover:cursor-pointer w-fit mx-auto border border-custom-blue">
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">Test your understanding</h2>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="items-center mb-2">
                            <p className="text-custom-blue font-medium">Go to {course.title.toLowerCase()} quiz</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetail;



