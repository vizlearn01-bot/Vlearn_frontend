import { useState, useEffect, useContext } from 'react';
import { Bell, Search, Bookmark, Clock, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Link, useNavigate } from "react-router";
import LazyLoad from 'react-lazyload';
import debounce from 'lodash.debounce';
import UserContext from '../../Context/UserContext';
import SideNav from '../../Components/User/SideNav';
import apiClient from '../../config/apiClient';

const COURSES_PER_PAGE = 8;

function Dashboard() {
  const [searchItem, setSearchItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(UserContext);
  
  // Curriculum States
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [viewMode, setViewMode] = useState('grades'); // 'grades' or 'subjects'
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Recent Lessons State
  const [recentLessons, setRecentLessons] = useState([]);

  // Legacy Videos States
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

    useEffect(() => {
    const fetchCurriculumAndVideos = async () => {
      if (!token?.access) {
        setError('Please log in to access your curriculum.');
        setIsLoading(false);
        return;
      }
      try {
        const gradesResponse = await apiClient.get('/api/curriculum/grades/');
        const fetchedGrades = gradesResponse.data.results || gradesResponse.data;
        setGrades(fetchedGrades);

        if (fetchedGrades.length === 1) {
          setSelectedGrade(fetchedGrades[0]);
          const subjectsResponse = await apiClient.get(
            `/api/curriculum/subjects/?grade=${fetchedGrades[0].id}`
          );
          setSubjects(subjectsResponse.data.results || subjectsResponse.data);
          setViewMode('subjects');
        } else {
          setViewMode('grades');
        }

        const videosResponse = await apiClient.get('/experiment_videos');
        const fetchedVideos = videosResponse.data.results || videosResponse.data || [];
        setCourses(fetchedVideos);
        setFilteredCourses(fetchedVideos);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurriculumAndVideos();

    // Fetch Recent Lessons from Local Storage
    const fetchRecentLessons = async () => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('vlearn_lesson_progress_'));
      const lessons = keys.map(k => {
        try {
          const data = JSON.parse(localStorage.getItem(k));
          const lessonId = k.replace('vlearn_lesson_progress_', '');
          return { ...data, lessonId, storageKey: k };
        } catch {
          return null;
        }
      }).filter(l => l && l.lessonTitle && l.topicId);
      
      const sorted = lessons.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0)).slice(0, 4);
      
      const validLessons = [];
      for (const lesson of sorted) {
          try {
              // Verify the lesson is still published
              await apiClient.get(`/api/curriculum/topics/${lesson.topicId}/lesson/`);
              
              // Clean up old 'Draft Lesson' prefix if cached
              if (lesson.lessonTitle.startsWith('Draft Lesson for ')) {
                  lesson.lessonTitle = lesson.lessonTitle.replace('Draft Lesson for ', '');
                  localStorage.setItem(lesson.storageKey, JSON.stringify(lesson));
              }
              validLessons.push(lesson);
          } catch {
              // If 404, it was deleted or unpublished. Remove stale cache.
              localStorage.removeItem(lesson.storageKey);
          }
      }
      setRecentLessons(validLessons);
    };
    fetchRecentLessons();
  }, [token]);

  // Reset to page 1 whenever search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchItem, activeCategory]);

  const handleGradeSelect = async (grade) => {
    setSelectedGrade(grade);
    setIsLoading(true);
    try {
      const subjectsResponse = await apiClient.get(
        `/api/curriculum/subjects/?grade=${grade.id}`
      );
      setSubjects(subjectsResponse.data.results || subjectsResponse.data);
      setViewMode('subjects');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectSelect = (subject) => {
    navigate(`/dashboard/subject/${subject.id}`);
  };

  const handleInputChange = debounce((e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    if (searchTerm === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        (course.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, 300);

  const filteredCategory = filteredCourses
    .filter(course => {
      if (activeCategory === 'All') return true;
      return course.category?.toLowerCase() === activeCategory?.toLowerCase();
    })
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const totalPages = Math.ceil(filteredCategory.length / COURSES_PER_PAGE);
  const paginatedCourses = filteredCategory.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const allCategories = courses.map(course => course.category);
  const uniqueCategories = ["All", ...new Set(allCategories)];

  return (
    <div className="flex">
      <SideNav />
      <main className="w-full">
        {/* Header */}
        <header className="flex items-start justify-normal p-4 md:gap-96 bg-white shadow-2xl top-0 fixed w-full z-10">
          <div className="relative w-1/3 md:w-1/3">
            <div className="flex items-center border border-custom-blue rounded-3xl overflow-hidden">
              <Search className="absolute left-3 h-5 w-5 text-custom-blue" />
              <input
                type="text"
                placeholder="Search..."
                defaultValue={searchItem}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-custom-blue placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6 md:ml-72">
            <button className="p-2 hover:bg-custom-blue hover:text-white rounded-3xl transition-colors duration-200">
              <Bell className="h-6 w-6 text-gray-600 hover:text-white" />
            </button>
            {user && (
              <Link to='/dashboard/user'>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Hi, {user.username}</span>
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6 pt-28">
          
          {/* CONTINUE LEARNING SECTION */}
          {recentLessons.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6 text-custom-blue" />
                Continue Learning
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentLessons.map(lesson => {
                  const pct = lesson.totalPages > 0 ? Math.round(((lesson.completedConcepts?.length || 0) / lesson.totalPages) * 100) : 0;
                  return (
                    <Link 
                      key={lesson.lessonId} 
                      to={`/lesson-viewer/${lesson.topicId}`}
                      className="block bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="h-2 bg-gradient-to-r from-custom-blue to-indigo-500 w-full" />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-blue-50 p-3 rounded-full text-custom-blue">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          {lesson.isCompleted ? (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-blue-50 text-custom-blue text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                              In Progress
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{lesson.lessonTitle}</h3>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-500 font-medium">Progress</span>
                             <span className="text-custom-blue font-bold">{pct}%</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                             <div className="bg-custom-blue h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                           </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* CURRICULUM SECTION */}
          <section className="mb-12">
            {viewMode === 'grades' ? (
              <h2 className="text-2xl font-bold mb-6 text-gray-800">My Classes</h2>
            ) : (
              <div className="flex items-center gap-4 mb-6">
                {grades.length > 1 && (
                  <button onClick={() => setViewMode('grades')} className="text-custom-blue hover:underline font-semibold flex items-center">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Classes
                  </button>
                )}
                <h2 className="text-2xl font-bold text-gray-800">{selectedGrade?.name} - Subjects</h2>
              </div>
            )}

            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-3xl h-48 animate-pulse"></div>
                  ))}
               </div>
            ) : viewMode === 'grades' ? (
              // Render Grades
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {grades.map(grade => (
                   <div 
                     key={grade.id} 
                     onClick={() => handleGradeSelect(grade)}
                     className="cursor-pointer group relative block bg-gradient-to-br from-custom-blue to-blue-800 rounded-3xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                   >
                     <div className="p-8 text-white">
                        <BookOpen className="w-12 h-12 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold mb-2">{grade.name}</h3>
                        <p className="text-blue-100">{grade.description || 'View curriculum'}</p>
                     </div>
                   </div>
                ))}
              </div>
            ) : (
              // Render Subjects
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subjects.length > 0 ? subjects.map(subject => (
                   <div 
                     key={subject.id} 
                     onClick={() => handleSubjectSelect(subject)}
                     className="cursor-pointer group relative bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                   >
                     <div className="h-2 bg-custom-blue w-full"></div>
                     <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{subject.description || 'Subject details'}</p>
                        
                        {/* UI Placeholder for Progress */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-500 font-medium">Progress</span>
                             <span className="text-custom-blue font-bold">0%</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                             <div className="bg-custom-blue h-1.5 rounded-full" style={{ width: '0%' }}></div>
                           </div>
                        </div>
                     </div>
                   </div>
                )) : (
                  <p className="text-gray-500">No subjects found for this grade.</p>
                )}
              </div>
            )}
          </section>

          {/* LEGACY EXPERIMENTS SECTION */}
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-center">Available Experiments & Resources</h2>
            {user && (
              <div className="flex flex-wrap justify-center my-6 gap-4">
                {uniqueCategories.sort().map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-custom-orange text-white'
                        : 'bg-custom-blue text-white hover:bg-custom-orange'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCourses.map((course) => (
                <div key={course.id} className="mb-6">
                  <Link to={`/coursedetails/${course.id}`} className="group relative block rounded-3xl shadow-sm overflow-hidden">
                    <LazyLoad height={200} offset={100} once>
                      <div className="relative">
                        <img src={course.image} alt={course.title} className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                            <h3 className="text-xl font-bold text-white line-clamp-2">{course.title}</h3>
                            <div className="flex gap-4 text-gray-200 text-sm">
                              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{course.duration}</span></div>
                              <div className="flex items-center gap-1"><Bookmark className="w-4 h-4" /><span>{course.category}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </LazyLoad>
                  </Link>
                  <h3 className="mt-3 font-semibold text-lg px-2 text-center">{course.title}</h3>
                </div>
              ))}
            </div>

            {/* Pagination Logic Simplified Here for Brevity */}
          </section>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;