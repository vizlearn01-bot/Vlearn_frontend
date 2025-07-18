import "/src/index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "../src/Pages/Home";
import Dashboard from "./Pages/Dashboard";
import ContactUs from "../src/Pages/ContactUs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import CourseDetail from "./Pages/CourseDetail";
import User from "./Pages/User";
import Resources from "./Pages/Resources";
import Quizzes from "./Pages/Quizzes";
import DashboardOutlet from "./Pages/DashboardOutlet";
// import Quiz from './Pages/Quiz';
import QuizAttempt from "./Pages/QuizAttempt";
import Results from "./Pages/Results";
import SubscriptionPlan from "./Components/SubscriptionPlan";
import Simulations from "./Pages/Simulations";
import { BillingAndPaymentsRoutes } from "./component-library/account-management/routes/BillingAndPayments";
import SubscriptionRestricted from "./component-library/billing-and-payments/subscriptions/SubscriptionRestricted";
import SubscriptionContextProvider from "./component-library/billing-and-payments/subscriptions/SubscriptionContextProvider";
import ProtectedRoute from "./component-library/account-management/authentication/ProtectedRoute";

function App() {
    const dashboardRoutes = {
        path: "dashboard",
        element: (
            <ProtectedRoute>
                <DashboardOutlet />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "home",
                element: (
                    <SubscriptionRestricted
                        allowedSubscriptionPlans={["pro_plan"]}
                    >
                        <Dashboard />
                    </SubscriptionRestricted>
                ),
            },
            {
                path: "user",
                element: <User />,
            },
            {
                path: "resources",
                element: (
                    <SubscriptionRestricted
                        allowedSubscriptionPlans={["pro_plan"]}
                    >
                        <Resources />
                    </SubscriptionRestricted>
                ),
            },
            {
                path: "quizzes",
                element: (
                    // <SubscriptionRestricted allowedSubscriptionPlans={["pro_plan"]}>
                    <Quizzes />
                ),
                // </SubscriptionRestricted>
            },
            {
                path: "simulations",
                element: (
                    <SubscriptionRestricted
                        allowedSubscriptionPlans={["pro_plan"]}
                    >
                        <Simulations />
                    </SubscriptionRestricted>
                ),
            },
            {
                path: "quiz/:id",
                element: <QuizAttempt />,
            },
            {
                path: "results",
                element: <Results />,
            },
        ],
    };

    const Router = createBrowserRouter([
        {
            path: "/",
            element: (
                <SubscriptionContextProvider>
                    <Outlet />
                </SubscriptionContextProvider>
            ),
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: "contact",
                    element: <ContactUs />,
                },
                {
                    path: "login",
                    element: <Login />,
                },
                {
                    path: "register",
                    element: <Signup />,
                },
                {
                    path: "subscription",
                    element: <SubscriptionPlan />,
                },
                {
                    path: "coursedetails/:id",
                    element: <CourseDetail />,
                },
                dashboardRoutes,
                BillingAndPaymentsRoutes(),
            ],
        },
    ]);
    return (
        <>
            {/* <UserProvider> */}
            <RouterProvider router={Router} />

            {/* <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path='/subscription' element={<SubscriptionPlan/>}/>
            <Route path='/admindashboard' element={<AdminDashboard/>}/>

            <Route path="/dashboard" element={<DashboardOutlet />}>
              <Route path='home' element={<Dashboard />} />
              <Route path="user" element={<User />} />
              <Route path="resources" element={<Resources />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="simulations" element={<Simulations />} />
              <Route path="quiz/:id" element={<QuizAttempt />} />
              <Route path="results" element={<Results />} />
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/coursedetails/:id" element={<CourseDetail />} />

          </Routes>
        </BrowserRouter> */}
            {/* </UserProvider> */}
        </>
    );
}

export default App;
