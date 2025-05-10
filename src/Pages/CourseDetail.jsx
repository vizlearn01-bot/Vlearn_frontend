import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { GraduationCap, User, Clock, BookOpen, BarChart2, Award } from "lucide-react";
import UserContext from "../Context/UserContext";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";

function CourseDetail() {
  const { id } = useParams(); // Get the id from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { user, token } = useContext(UserContext);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const intervalRef = useRef(null);
  const [quiz, setQuiz] = useState([])
  const navigate = useNavigate()

  // Fetch course details using the id from the URL
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses/${id}`);
        setCourse(response.data); // Set the course details
        console.log(response.data); // Log the whole response
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
        console.log(response.data)
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };
    fetchQuizzes();
  }, [id]);



  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center items-center">
          <div className="animate-spin border-4 border-t-4 border-custom-blue border-solid rounded-full w-16 h-16 mx-auto"></div>
          <p className="text-custom-orange">Loading course details...</p>
        </div>
      </div>
    );
  }

  const countDownAlert = (quizId) => {
    let seconds = 5; // Set countdown time in seconds
    let timerInterval;

    Swal.fire({
      title: "Your test begins in",
      html: `
          <div class="items-center gap-2">
            <b id="countdown" class="text-4xl font-bold text-custom-blue texts-center">${seconds}</b>
            <span class="text-gray-600 items-center text-2xl">seconds</span>
          </div>
        `,
      timer: seconds * 1000, // Convert to milliseconds
      timerProgressBar: false,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-10 w-fit'
      },
      allowOutsideClick: false,
      didOpen: () => {
        const countdownElement = Swal.getHtmlContainer().querySelector("#countdown");
        timerInterval = setInterval(() => {
          seconds--;
          countdownElement.textContent = seconds;
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: "Your quiz starts now!",
          timer: 1500, // Show for 1.5 seconds
          timerProgressBar: false,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl shadow-2xl p-10 w-fit text-custom-orange'
          },
          willClose: () => {
            navigate(`/dashboard/quiz/${quizId}`);
          }
        });
      }
    });
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
                <div className="w-full h-2/3">
                <div>
                  {/* Use ReactPlayer to play the fetched playback_url */}
                  {course?.playback_url ? (
                    <ReactPlayer
                      url={course.playback_url}
                      controls
                      width="100%"
                      height="auto"
                      playing
                      config={{
                        file: {
                          attributes: {
                            crossOrigin: "anonymous",
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>Loading video...</p>
                  )}
                </div>

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
                      <p className="text-lg font-semibold text-slate-900">{course.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Level</p>
                      <p className="text-lg font-semibold text-slate-900">Grade {course.level}</p>
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
                        <span className="text-sm text-slate-500 ">{course.duration}</span>
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
                <div className=" backdrop-blur-2xl mt-10 items-center text-center p-8 rounded-3xl w-fit mx-auto shadow-2xl">
                  <h3 className="text-custom-blue text-xl">Test your understanding</h3>
                  <button
                    onClick={() => countDownAlert(quiz.id)}
                    className="bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange w-fit mx-auto flex mt-4">
                    Attempt quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetail;



