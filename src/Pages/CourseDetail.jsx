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
    <div className="p-8 mx-auto max-w-8xl flex flex-col gap-8">
      {/* Video or Image Section */}
      <div>
        {videoID ? (
          <div className="mb-4 aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${videoID}`}
              title="Course Video"
              className="w-full h-96 rounded-lg shadow-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Course Details */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
        <p className="mt-4 text-gray-700 leading-relaxed">{course.description} Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
          Fuga voluptates enim odio quos ipsum. Vitae, consectetur. Repellat quis harum iure maiores debitis repudiandae nam illo, labore voluptatum, 
          officiis temporibus nisi exercitationem. Corporis temporibus facilis pariatur architecto repudiandae, quia nostrum magni earum assumenda, 
          accusamus sit nam placeat, harum reprehenderit quas illo! Non a fugiat recusandae perferendis provident ipsum hic, porro tenetur, 
          sit nesciunt unde debitis odit earum est esse, iste animi nihil ducimus beatae veniam quia tempore deleniti. Est doloribus numquam molestiae. 
          Dolorem et laboriosam perferendis quia. Quidem maiores ipsum vero repudiandae consectetur sequi dicta aperiam reprehenderit veritatis doloribus 
          consequatur explicabo saepe non alias optio laborum labore itaque sunt eaque, illum quos praesentium debitis eligendi modi! Debitis rerum ipsum 
          nulla recusandae laborum vitae nam provident ad aspernatur eos! Velit hic magni, alias quasi vitae placeat tempora sint expedita commodi quis! 
          Atque enim veniam ipsam magni excepturi rem rerum inventore corrupti distinctio alias quod doloremque blanditiis consequatur tempore accusantium 
          quo eligendi, fuga, qui explicabo! Consequatur earum eaque accusamus recusandae aliquam error incidunt doloremque harum dolorem numquam iure odit 
          dignissimos qui autem minima saepe, optio, explicabo aspernatur, rem iusto sint! Dolor accusamus temporibus, qui libero commodi voluptatum, 
          ipsum aliquam ipsam laborum alias tenetur!</p>
      </div>

      {/* Instructor and Additional Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Instructor:</h3>
          <p className="text-gray-700">{course.instructor}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Duration:</h3>
          <p className="text-gray-700">{course.duration}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Difficulty:</h3>
          <p className="text-gray-700">{course.difficulty}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Rating:</h3>
          <p className="text-gray-700">{course.rating} / 5</p>
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h2 className="text-xl font-semibold mt-8 text-gray-800">Lessons:</h2>
        {course.lessons?.length > 0 ? (
          <ul className="list-disc list-inside mt-2 text-gray-600">
            {course.lessons.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-2">No lessons available.</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
