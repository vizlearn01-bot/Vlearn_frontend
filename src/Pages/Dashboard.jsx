import { useState, useEffect, useContext } from 'react';
import { BookOpen, GraduationCap, Bell, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import debounce from 'lodash.debounce';
import UserContext from '../Context/UserContext'; 
import BASE_URL from '../config';

function Dashboard() {
  const [searchItem, setSearchItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user, token, logout } = useContext(UserContext); // Consume UserContext

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/course_videos`, {
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
  }, [token]);

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

  // Handle logout
  const handleLogout = () => {
    logout();
    // Optionally, redirect to the login page
  };

  // Navigation items
  const navItems = [
    { icon: GraduationCap, text: 'Home', path: '/' },
    { icon: BookOpen, text: 'My Courses', path: '/dashboard' },
  ];

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-custom-blue text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r p-4 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-10 w-10 text-custom-blue" />
          <Link to="/">
            <h1 className="text-3xl font-bold text-gray-800">VizLearn</h1>
          </Link>
        </div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex items-center gap-3 w-full p-3 text-gray-700 hover:bg-indigo-50 hover:text-custom-blue rounded-lg"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-8 w-full">
        {/* User Info and Logout */}
        <div className="flex items-center space-x-4 mb-8">
          {user ? (
            <>
              <span className="font-medium">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded-3xl text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <p>Please log in</p>
          )}
        </div>

        {/* Search Bar */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-full md:w-1/3 border border-custom-blue rounded-3xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-blue" />
            <input
              type="text"
              placeholder="Search courses..."
              defaultValue={searchItem}
              onChange={handleInputChange}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-custom-blue"
            />
          </div>
          <button className="p-3 hover:bg-custom-blue hover:text-white rounded-3xl">
            <Bell className="h-5 w-5" />
          </button>
        </header>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Courses Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Courses</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-3xl h-56 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <Link to={`/coursedetails/${course.id}`} key={course.id}>
                  <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    <LazyLoad height={200} offset={100} once>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-56 object-cover"
                        loading="lazy"
                      />
                    </LazyLoad>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;