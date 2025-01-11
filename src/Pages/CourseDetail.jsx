import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CourseDetail() {
  const { id } = useParams(); // Get the id from the URL
  const [course, setCourse] = useState('');

  // Fetch course details using the id from the URL
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/courses/${id}`);
        setCourse(response.data); // Set the course details
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [id]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-64 object-cover mt-4 rounded-lg shadow"
      />
      <p className="mt-4 text-gray-700 leading-relaxed">{course.description}</p>
      
      <h2 className="text-xl font-semibold mt-8 text-gray-800">Lessons:</h2>
      <ul className="list-disc list-inside mt-2 text-gray-600">
        {course.lessons?.map((lesson, index) => (
          <li key={index}>{lesson}</li>
        ))}
      </ul>

      {/* Display additional details */}
      <h2 className="text-xl font-semibold mt-8 text-gray-800">Additional Resources:</h2>
      {course.videoLink && (
        <div className="mt-4">
          <a
            href={course.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Watch Course Overview Video
          </a>
        </div>
      )}

      {/* Handle cases where additional details are not available */}
      {!course.videoLink && (
        <p className="mt-4 text-gray-500">No additional resources available for this course.</p>
      )}
    </div>
  );
}

export default CourseDetail;
