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

  // Extract YouTube video ID from the URL
  const extractVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  const videoID = course.videoLink ? extractVideoID(course.videoLink) : null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
      
      {/* Conditionally render video or image */}
      {videoID ? (
        <div className="mt-4 aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoID}`}
            title="Course Video"
            className="w-full h-96 rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-64 object-cover mt-4 rounded-lg shadow"
        />
      )}

      <p className="mt-4 text-gray-700 leading-relaxed">{course.description}</p>
      
      <h2 className="text-xl font-semibold mt-8 text-gray-800">Lessons:</h2>
      <ul className="list-disc list-inside mt-2 text-gray-600">
        {course.lessons?.map((lesson, index) => (
          <li key={index}>{lesson}</li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetail;
