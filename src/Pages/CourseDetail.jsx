import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { GraduationCap, Users2 } from "lucide-react";

function CourseDetail() {
  const { id } = useParams(); // Get the id from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch course details using the id from the URL
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses/${id}`);
        setCourse(response.data); // Set the course details
        setLoading(false); // Set loading to false when data is fetched
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchCourseDetails();
  }, [id]);

  // Extract YouTube video ID from the URL
  const extractVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  // Extract the video ID if available
  const videoID = course?.video_link ? extractVideoID(course.video_link) : null;

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
        <nav className="fixed w-full flex flex-col md:flex-row items-center justify-between p-2 shadow-2xl">
          {/* First Section: Logo and VizLearn Heading */}
          <div className="items-center gap-2 hidden md:flex">
            <GraduationCap className="h-10 w-10 text-custom-blue" />
            <Link to="/dashboard">
              <h1 className="text-3xl font-bold text-gray-800">VizLearn</h1>
            </Link>
          </div>
          {/* Second Section: Course Title, Subtitle, and Student Count */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center mt-6 md:mt-0">
            <div>
              <h1 className="text-3xl font-bold text-custom-blue">{course?.title}</h1>
              <p className="mt-1 text-slate-600">Course subtitle: {course?.subtitle}</p>
            </div>

          </div>
          <div className="items-center text-slate-700 mt-6 md:mt-0 hidden md:flex">
              <Users2 className="h-5 w-5 mr-2" />
              <span>8 students</span>
            </div>
        </nav>
        {/* Video or Image Section */}
        <div className="mt-48 md:mt-28">
          {videoID ? (
            <div className="mb-4 aspect-w-16 mx-auto  max-w-6xl aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${videoID}`}
                title="Course Video"
                className="w-full h-96 rounded-3xl shadow-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            course?.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            )
          )}
        </div>

        {/* Course Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
          <p className="mt-4 text-gray-700 leading-relaxed">{course?.description}</p>
        </div>

        {/* Instructor and Additional Info */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Instructor:</h3>
            <p className="text-gray-700">{course?.instructor}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Duration:</h3>
            <p className="text-gray-700">{course?.duration}</p>
          </div>
          {/* <div>
          <h3 className="text-xl font-semibold text-gray-800"> Uploaded on:</h3>
          <p className="text-gray-700">{course?.updated_at}</p>
        </div> */}
        </div>

        {/* Lessons */}
        {/* <div>
        <h2 className="text-xl font-semibold mt-8 text-gray-800">Requirements:</h2>
        {course?.requirements?.length > 0 ? (
          <ul className="list-disc list-inside mt-2 text-gray-600">
            {course.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-2">List of requirements not available.</p>
        )}
      </div> */}
      </div>
    </>

  );
}

export default CourseDetail;
