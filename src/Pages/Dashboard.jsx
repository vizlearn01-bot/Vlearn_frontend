import { useState, useEffect } from 'react';
import { BookOpen, Calendar, GraduationCap, BarChart2, 
    Clock, Award, Bell, Search, User
  } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

function Dashboard() {
  const [searchItem, setSearchItem] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courses, setCourses] = useState([]); // Initialize courses state
  
  const URL = "http://localhost:3000/courses"; // The fake API URL

  // Fetch courses when the component is mounted
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(URL);
        setCourses(response.data); // Set courses to the fetched data
        setFilteredCourses(response.data); // Set filteredCourses as well
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    if (searchTerm === '') {
      setFilteredCourses(courses); // If the search input is empty, show all courses
    } else {
      const filterItems = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) // Filter courses by title
      );
      setFilteredCourses(filterItems); // Update filtered courses
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-10 w-10 text-custom-blue" />
          <Link to="/"><h1 className="text-3xl font-bold text-gray-800">VizLearn</h1></Link>
        </div>

        <nav className="space-y-2">
          {[
            { icon: BookOpen, text: 'My Courses' },
            { icon: Calendar, text: 'Schedule' },
            { icon: BarChart2, text: 'Progress' },
            { icon: Clock, text: 'Recent' },
            { icon: Award, text: 'Certificates' },
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
      <main className='ml-64 p-8 w-5/6'>
        <header className="flex items-center justify-between mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-blue" />
            <input
              type="text"
              placeholder="Search courses..."
              onChange={handleInputChange}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-custom-blue"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 hover:bg-custom-blue hover:text-white rounded-3xl">
              <Bell className="h-5 w-5 hover:text-white" />
            </button>
            <button className="flex items-center gap-2 p-3 hover:bg-custom-blue hover:text-white rounded-3xl">
              <User className="h-5 w-5 hover:text-white" />
              <span className="text-sm hover:text-white">John Doe</span>
            </button>
          </div>
        </header>

        {/* Current Courses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-11/12 h-auto">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
