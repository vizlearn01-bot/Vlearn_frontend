import { Outlet } from "react-router";
import SideNav from "../../Components/User/SideNav";

function DashboardOutlet() {
  return (
    <div className="flex">
      <SideNav />
      {/* Main Content */}
      
      <main className="md:ml-64 w-full">
        <Outlet /> {/* This will render the matched child route */}
      </main>
    </div>
  );
}

export default DashboardOutlet;