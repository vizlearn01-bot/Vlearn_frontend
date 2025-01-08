import { 
    BookOpen, 
    Calendar, 
    GraduationCap, 
    BarChart2, 
    Clock, 
    Award,
    Bell,
    Search,
    User
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
      <main className='ml-64 p-8'>
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
      </main>
    </>
  )
}

export default Dashboard1
