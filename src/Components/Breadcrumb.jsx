import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const Breadcrumb = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return; // no course id in path

    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/courses/${id}/`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center space-x-2">
            {index > 0 && <span className="mx-1">/</span>}
            <Link to={crumb.path} className="hover:underline">
              {crumb.name}
            </Link>
          </li>
        ))}

        {/* Show course title only if loaded */}
        {!loading && course && (
          <>
            <span className="mx-1">/</span>
            <li className="text-gray-800 font-medium">{course.title}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
