import { Outlet } from "react-router";
import SideNav from '../Components/SideNav';
import SubscriptionRestricted from "../component-library/billing-and-payments/subscriptions/SubscriptionRestricted";

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