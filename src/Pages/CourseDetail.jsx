import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CourseDetail() {
  const { id } = useParams(); // Get the id from the URL
  const [course, setCourse] = useState(null);

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
  }, [id]); // Re-run when id changes

  if (!course) {
    return <p>Loading...</p>; // Show a loading message while fetching
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <img src={course.image} alt={course.title} className="w-full h-64 object-cover mt-4" />
      <p className="mt-4 text-gray-700">{course.description}</p>
      {/* Add any additional course details here */}
    </div>
  );
}

export default CourseDetail;
