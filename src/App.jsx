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
import Courses from './Pages/Courses';
import Quizzes from './Pages/Quizzes';
import Resources from './Pages/Resources';
import DashboardOutlet from './Pages/DashboardOutlet';

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
            <Route path="/dashboard" element={<DashboardOutlet />}>
              <Route path='home' element={<Dashboard/>}/>
              <Route path="user" element={<User />} />
              <Route path="courses" element={<Courses />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="resources" element={<Resources />} />
              <Route index element={<Dashboard/>}/>
            </Route>
            <Route path="/coursedetails/:id" element={<CourseDetail />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;