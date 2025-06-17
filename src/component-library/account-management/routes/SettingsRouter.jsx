import AdminSideBar from "../../../components/stores/admin/sidebars/AdminSideBar";
import ScaffoldWithSideBar from "../../layout/scaffold/ScaffoldWithSideBar";
import ProtectedRoute from "../authentication/ProtectedRoute";
import { AccountRoutes } from "./AccountRouter";
import { BillingAndPaymentsRoutes } from "./BillingAndPayments";
import { UserProfileRoutes } from "./UserProfileRouter";
import { Navigate, Outlet } from "react-router";

export const SettingsRoutes = () => {
    return {
        path: "settings",
        element: (
            <ProtectedRoute>
                <ScaffoldWithSideBar
                    headerTitle="Settings"
                    sidebarComponent={<AdminSideBar />}
                    tabs={[
                        { label: "My Profile", route: "profile" },
                        {
                            label: "User Management",
                            route: "account/users",
                            exact: false,
                        },
                        {
                            label: "Billing & Subscriptions",
                            route: "billing-and-payments",
                            exact: false,
                        },
                    ]}
                >
                    <Outlet />
                </ScaffoldWithSideBar>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="profile" replace />,
            },
            UserProfileRoutes(),
            AccountRoutes(),
            BillingAndPaymentsRoutes(),
        ],
    };
};

const SettingsRouter = () => {
    return useRoutes(SettingsRoutes());
};

export default SettingsRouter;
