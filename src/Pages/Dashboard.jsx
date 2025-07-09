import { useState, useEffect, useContext } from 'react';
import { Bell, Search, Bookmark, Clock } from 'lucide-react';
import { Link } from "react-router";
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import debounce from 'lodash.debounce';
import UserContext from '../Context/UserContext';
import BASE_URL from '../config';
import SideNav from '../Components/SideNav';
import { filter } from 'lodash';

function Dashboard() {
  const [searchItem, setSearchItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const { user, token } = useContext(UserContext); // Consume UserContext
  const [activeCategory, setActiveCategory] = useState('All');
  const [videoCount, setVideoCount] =  useState(0)


  // Fetch courses on component mount
  useEffect(() => {
     const fetchVideoCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/video-count`);
        console.log(response.data)
        setVideoCount(response.data)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideoCount();
    
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/experiment_videos`, {
          headers: {
            Authorization: `Bearer ${token?.access}`, // Use the token from context
          },
        });
        setCourses(response.data);
        setFilteredCourses(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch courses. Please try again.');
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token?.access) {
      fetchCourses(); // Fetch courses only if the token is available
    } else {
      setError('Please log in to access courses.');
      setIsLoading(false);
    }
  }, [token]
);

  // Debounced search input handler
  const handleInputChange = debounce((e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    if (searchTerm === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, 300);

  const filteredCategory = filteredCourses
    .filter(course => {
      if (activeCategory === 'All') return true;
      return course.category?.toLowerCase() === activeCategory.toLowerCase();
    });

// extracts and removes duplicates from the categories
  const allCategories = courses.map(course => course.category)
  const uniqueCategories = ["All", ...new Set(allCategories)]
console.log(user)
  return (
    <div className="flex">
      <SideNav />
      {/* Main Content */}
      <main className="w-full">
        {/* Search Bar */}
        <header className="flex items-start justify-normal p-4 md:gap-96 bg-white shadow-2xl top-0 fixed w-full z-10">
          {/* Search Bar */}
          <div className="relative w-1/3 md:w-1/3">
            <div className="flex items-center border border-custom-blue rounded-3xl overflow-hidden">
              <Search className="absolute left-3 h-5 w-5 text-custom-blue" />
              <input
                type="text"
                placeholder="Search courses..."
                defaultValue={searchItem}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2 w-2xl focus:outline-none focus:ring-2 focus:ring-custom-blue placeholder-gray-400"
              />
            </div>
          </div>

          {/* User Info*/}
          <div className="flex items-center space-x-6 md:ml-72">
            {/* Notification Bell */}
            <button className="p-2 hover:bg-custom-blue hover:text-white rounded-3xl transition-colors duration-200">
              <Bell className="h-6 w-6 text-gray-600 hover:text-white" />
            </button>

            {/* User Info */}
            {user ? (
              <Link to='/dashboard/user'>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Hi, {user.username}</span>
                </div>
              </Link>
            ) : null}
          </div>

          {/* Error Message */}
          {error && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 z-10">
              <div className="bg-white p-6 rounded-3xl shadow-2xl text-center max-w-md mx-4">
                <p className="text-red-500 font-medium text-lg mb-4">
                  Login Required
                </p>
                <p className="text-gray-600">
                  Please log in to access the experiments.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-block bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange transition"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Courses Section */}
        <section className="mb-8 p-6 pt-24 h-fit">
          {user ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">Available experiments</h2>
              <div className="flex flex-wrap justify-center my-6 gap-4">
                {uniqueCategories
                  .sort()
                  .map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                        ? 'bg-custom-orange text-white'
                        : 'bg-custom-blue text-white hover:bg-custom-orange'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
              </div></>

          ) : null}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-3xl h-56 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategory
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((course) => (
                  <div key={course.id} className="mb-6">
                    {/* Clickable card area with hover effects */}
                    <Link
                      to={`/coursedetails/${course.id}`}
                      className="group relative block rounded-3xl shadow-sm  overflow-hidden"
                    >
                      <LazyLoad height={200} offset={100} once>
                        <div className="relative">
                          {/* Course Image with Zoom Effect */}
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                              <h3 className="text-xl font-bold text-white line-clamp-2">
                                {course.title}
                              </h3>
                              <div className="flex gap-4 text-gray-200 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bookmark className="w-4 h-4" />
                                  <span>{course.category}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </LazyLoad>
                    </Link>

                    {/* Visible title outside the card */}
                    <h3 className="mt-3 font-semibold text-lg px-2 text-center">
                      {course.title}
                    </h3>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;





