import '/src/index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import VideoUploadForm from './Pages/VideoUploadForm';

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path='/subscription' element={<SubscriptionPlan/>}/>
            <Route path='/video' element={<VideoUploadForm/>}/>
            
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
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;