import '/src/index.css';
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router";
import Home from '../src/Pages/Home';
import Dashboard from './Pages/Dashboard';
import ContactUs from '../src/Pages/ContactUs';
import Login from './Components/Login';
import Signup from './Components/Signup';
import CourseDetail from './Pages/CourseDetail';
import { UserProvider } from './Context/UserContext';
import User from './Pages/User';
import Resources from './Pages/Resources';
import Quizzes from './Pages/Quizzes';
import DashboardOutlet from './Pages/DashboardOutlet';
// import Quiz from './Pages/Quiz';
import QuizAttempt from './Pages/QuizAttempt';
import Results from './Pages/Results';
import SubscriptionPlan from './Components/SubscriptionPlan';
import Simulations from './Pages/Simulations';
import AdminDashboard from './Pages/AdminDashboard'
import BillingAndPaymentsRouter, { BillingAndPaymentsRoutes } from './component-library/account-management/routes/BillingAndPayments';


function App() {
  const dashboardRoutes = {
    path: "dashboard",
    element: <DashboardOutlet />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "home",
        element: <Dashboard />
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "resources",
        element: <Resources />
      },
      {
        path: "quizzes",
        element: <Quizzes />
      },
      {
        path: "simulations",
        element: <Simulations />
      },
      {
        path: "quiz/:id",
        element: <QuizAttempt />
      },
      {
        path: "results",
        element: <Results />
      },
    ]
  }

  const Router = createBrowserRouter(
    [{
      path: "/",
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "contact",
          element: <ContactUs />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Signup />
        },
        {
          path: "subscription",
          element: <SubscriptionPlan />
        },
        {
          path: "coursedetails/:id",
          element: 
            <CourseDetail />
        },
        dashboardRoutes,
        BillingAndPaymentsRoutes(),
      ]
    }]
  )
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