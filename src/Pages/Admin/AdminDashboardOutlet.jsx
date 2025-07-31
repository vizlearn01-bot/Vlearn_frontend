import { Outlet } from "react-router";
import AdminSideNav from "../../Components/Admin/AdminSideNav"


function AdminDashboardOutlet() {
  return (
    <div className="flex">
      <AdminSideNav />
      {/* Main Content */}

      <main className="md:ml-64 w-full">
        <Outlet /> {/* This will render the matched child route */}
      </main>
    </div>
  );
}

export default AdminDashboardOutlet;