import { Outlet } from 'react-router-dom';
import SideNav from '../Components/SideNav';

function Dashboard() {
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

export default Dashboard;