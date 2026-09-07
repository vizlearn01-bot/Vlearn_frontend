import { Outlet } from "react-router";
import AdminSideNav from "../../Components/Admin/AdminSideNav";
import GenerationMonitor from "../../Components/Admin/GenerationMonitor";

function AdminDashboardOutlet() {
  return (
    <div className="flex">
      <AdminSideNav />
      {/* Main Content */}
      <main className="md:ml-64 w-full relative min-h-screen">
        <GenerationMonitor />
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboardOutlet;