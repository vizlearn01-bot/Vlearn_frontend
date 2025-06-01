import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { GraduationCap, User } from "lucide-react";
import UserContext from "../Context/UserContext";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "../Components/Breadcrumb";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses/${id}/`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setQuizLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/quizzes/`);
        const courseQuiz = response.data.find(q => q.video === parseInt(id));
        setQuiz(courseQuiz || null);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setQuiz(null);
      } finally {
        setQuizLoading(false);
      }
    };
    fetchQuizzes();
  }, [id]);

  const countDownAlert = (quizId) => {
    if (!quizId) {
      Swal.fire({
        title: "No Quiz Available",
        text: "There is no quiz associated with this course yet.",
        icon: "info",
        customClass: {
          popup: 'rounded-3xl shadow-2xl p-10'
        }
      });
      return;
    }

    let seconds = 5;
    let timerInterval;

    Swal.fire({
      title: "Your test begins in",
      html: `
          <div class="items-center gap-2">
            <b id="countdown" class="text-4xl font-bold text-custom-blue texts-center">${seconds}</b>
            <span class="text-gray-600 items-center text-2xl">seconds</span>
          </div>
        `,
      timer: seconds * 1000,
      timerProgressBar: false,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-10 w-fit'
      },
      allowOutsideClick: false,
      didOpen: () => {
        const countdownElement = document.getElementById("countdown");
        timerInterval = setInterval(() => {
          seconds--;
          if (countdownElement) {
            countdownElement.textContent = seconds;
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: "Your quiz starts now!",
          timer: 1500,
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
  };

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

  return (
    <div className="mx-auto flex flex-col">
      <nav className="fixed w-full flex flex-col md:flex-row items-center justify-between p-2 shadow-2xl bg-white">
        <div className="items-center gap-2 hidden md:flex p-4">
          <GraduationCap className="h-10 w-10 text-custom-blue" />
          <Link to="/dashboard">
            <h1 className="text-3xl font-bold text-gray-800">VizLearn</h1>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center text-center mt-2 md:mt-0">
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <div className="w-full md:h-2/3">
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
              <div className="rounded-3xl shadow-2xl px-8 py-4 md:my-6 my-2">
                <h2 className="text-2xl font-bold text-slate-900">{course.title}</h2>
                <p className="text-slate-600 mt-2 mb-4">{course.description}</p>
                <p className="text-slate-500 mt-4">
                  Duration: <span className="font-semibold">{course.duration}</span>
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <Breadcrumb/>
              <div className="mb-8 flex justify-center">
                <Link to="/dashboard" className="flex items-center text-custom-blue hover:text-custom-orange hover:cursor-pointer transition-colors">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Back to main dashboard</span>
                </Link>
              </div>
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
                    <p className="text-sm text-slate-500">Last Updated</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date().toLocaleDateString()} {course.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-2xl mt-10 items-center text-center p-8 rounded-3xl w-fit mx-auto shadow-2xl">
                <h3 className="text-custom-blue text-xl">Test your understanding</h3>
                {quizLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin border-4 border-t-4 border-custom-blue border-solid rounded-full w-8 h-8 mx-auto"></div>
                    <p className="text-custom-blue mt-2">Checking for quiz...</p>
                  </div>
                ) : (
                  <button
                    onClick={() => quiz ? countDownAlert(quiz.id) : Swal.fire({
                      title: "No Quiz Available",
                      text: "This course doesn't have a quiz yet.",
                      icon: "info",
                      customClass: {
                        popup: 'rounded-3xl shadow-2xl p-10'
                      }
                    })}
                    className={`bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange w-fit mx-auto flex mt-4 ${!quiz ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={!quiz}
                  >
                    Attempt quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;