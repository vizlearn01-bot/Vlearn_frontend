import { 
    BookOpen, 
    Calendar, 
    GraduationCap, 
    BarChart2, 
    Clock, 
    Award,
    // Bell,
    // Search,
    // User
  } from 'lucide-react';

function Dashboard1() {
  return (
    <>
       <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-custom-blue" />
          <h1 className="text-xl font-bold text-gray-800">EduLearn</h1>
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
    </>
  )
}

export default Dashboard1
