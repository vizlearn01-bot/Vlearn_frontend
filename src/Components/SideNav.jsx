import { Link, useNavigate } from 'react-router-dom';
import { Menu, GraduationCap, BookOpen, User, LayoutDashboardIcon, ClipboardPen, FolderClosed } from 'lucide-react';
import { useState, useContext } from 'react';
import UserContext from '../Context/UserContext';
import Swal from 'sweetalert2';

const SideNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(UserContext);
  const navigate = useNavigate()

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!"
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Call logout only after confirmation
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success"
        }).then(() => {
          navigate("/login")
        })
      }
    });
  };

  const navItems = [
    { icon: LayoutDashboardIcon, text: 'Dashboard', path: 'dashboard' },
    { icon: User, text: "User profile", path: 'user' },
    { icon: BookOpen, text: "My courses", path: 'courses' },
    { icon: ClipboardPen, text: "Quizzes", path: 'quizzes' },
    { icon: FolderClosed, text: "Resources", path: 'resources' },
  ];

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-custom-blue text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r p-4 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-600 w-full text-white rounded-3xl text-sm hover:bg-red-800 transition-colors duration-200"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default SideNav;
