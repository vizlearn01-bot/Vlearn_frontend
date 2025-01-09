import { BookOpen, Calendar, GraduationCap, BarChart2, 
    Clock, Award,Bell,Search,User
  } from 'lucide-react';
import { Link } from 'react-router-dom';
function Dashboard() {
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
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: 'Introduction to React',
                progress: 75,
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Advanced JavaScript',
                progress: 45,
                image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
              },
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-custom-blue h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{course.progress}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </>
  )
}

export default Dashboard;
