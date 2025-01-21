import { useState, useEffect } from 'react';
import {
  BookOpen,
  // Calendar,
  GraduationCap,
  // BarChart2,
  // Clock,
  // Award,
  Bell,
  Search,
  // User,
  Menu,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyLoad from 'react-lazyload';

function Dashboard() {
  const [searchItem, setSearchItem] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const URL = 'https://vlearn-backend-254w.onrender.com/video-courses/';

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(URL);
        setCourses(response.data);
        setFilteredCourses(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Handle search input
  const handleInputChange = (e) => {
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
  };
  

  return (
    <div className="flex">
      {/* Hamburger Button for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-custom-blue text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-40 transition-transform duration-300 ease-in-out ${
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
          {[
            { icon: BookOpen, text: 'My Courses' },
            // { icon: Calendar, text: 'Schedule' },
            // { icon: BarChart2, text: 'Progress' },
            // { icon: Clock, text: 'Recent' },
            // { icon: Award, text: 'Certificates' },
          ].map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-3 w-full p-3 text-gray-700 hover:bg-indigo-50 hover:text-custom-blue rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-8 w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-full md:w-1/3 border border-custom-blue rounded-3xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-blue" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchItem}
              onChange={handleInputChange}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-custom-blue"
            />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="p-3 hover:bg-custom-blue hover:text-white rounded-3xl">
              <Bell className="h-5 w-5" />
            </button>
            {/* <button className="flex items-center gap-2 p-3 hover:bg-custom-blue hover:text-white rounded-3xl">
              <User className="h-5 w-5" />
              <span className="text-sm">John Doe</span>
            </button> */}
          </div>
        </header>

        {/* Current Courses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link to={`/coursedetails/${course.id}`} key={course.id}>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Apply LazyLoad to the image */}
                  <LazyLoad height={200} offset={100} once>
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-56 object-cover"
                      loading="lazy"
                      placeholder={<p>Loading...</p>}
                    />
                  </LazyLoad>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {course.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
