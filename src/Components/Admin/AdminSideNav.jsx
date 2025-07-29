import { Link, useNavigate } from "react-router";
import {
    Menu, GraduationCap,ChartNoAxesCombined, Library, LayoutDashboard, UserCog, FolderClosed, X
} from 'lucide-react';
import { useState, useContext, useRef, useEffect } from 'react';

import UserContext from '../../Context/UserContext';
import Swal from 'sweetalert2';

const SideNav = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null); //Ref for sidebar
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();

    // 👇 useEffect to handle outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                window.innerWidth < 768 // Only on small screens
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        { icon: LayoutDashboard, text: "Dashboard", path: '/dashboard/AdminDashboard' },
        { icon: Library, text: 'Course management', path: '/dashboard/home' },
        { icon: UserCog, text: "User management", path: '/dashboard/user' },
        { icon: ChartNoAxesCombined, text: "Analytics and reports", path: '/dashboard/resources' },
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
                ref={sidebarRef} // Attach ref
                className={`fixed left-0 top-0 z-20 h-screen w-64 bg-white border-r border-gray-300 p-4 transition-transform duration-300 flex flex-col justify-between
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

                {/* Logout button */}
                <div className="mt-auto pt-4 border-t border-gray-300">
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
