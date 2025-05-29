import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, GraduationCap, User, ClipboardPen, FolderClosed,
  Home, ClipboardCheck, Cpu, X
} from 'lucide-react';
import { useState, useContext } from 'react';
import UserContext from '../Context/UserContext';
import Swal from 'sweetalert2';

const SideNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#02a0bf",
      cancelButtonColor: "#ff4900",
      confirmButtonText: "Yes, log me out!"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success"
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  const navItems = [
    { icon: Home, text: 'Dashboard', path: '/dashboard/home' },
    { icon: User, text: "User profile", path: '/dashboard/user' },
    { icon: FolderClosed, text: "Resources", path: '/dashboard/resources' },
    { icon: ClipboardPen, text: "Quizzes", path: '/dashboard/quizzes' },
    { icon: ClipboardCheck, text: "Past Quizzes", path: '/dashboard/results' },
    { icon: Cpu, text: "Simulations", path: '/dashboard/simulations' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-custom-blue text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-20 h-screen w-64 bg-white border-r p-4 transition-transform duration-300 flex flex-col justify-between
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div>
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
                className="flex items-center gap-3 w-full p-3 text-gray-700 hover:bg-indigo-50 hover:text-custom-blue rounded-3xl"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.text}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout button at the bottom */}
        <div className="mt-auto pt-4 border-t">
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-600 w-full text-white rounded-3xl text-sm hover:bg-red-800 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNav;
