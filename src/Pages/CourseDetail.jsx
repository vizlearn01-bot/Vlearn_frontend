import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CourseDetail() {
  const { id } = useParams(); // Get the id from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch course details using the id from the URL
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`https://vlearn-backend-254w.onrender.com/courses/${id}`);
        setCourse(response.data); // Set the course details
        setLoading(false); // Set loading to false when data is fetched
        console.log(response.data); // Check if the data is correct
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
    <div className="p-8 mx-auto max-w-6xl flex flex-col gap-8">
      {/* Video or Image Section */}
      <div>
        {videoID ? (
          <div className="mb-4 aspect-w-16 aspect-h-9">
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
        <div>
          <h3 className="text-xl font-semibold text-gray-800"> Uploaded on:</h3>
          <p className="text-gray-700">{course?.updated_at}</p>
        </div>
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
  );
}

export default CourseDetail;
