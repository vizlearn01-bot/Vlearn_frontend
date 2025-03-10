
import '/src/index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../src/Pages/Home'
import Dashboard from './Pages/Dashboard'
import ContactUs from '../src/Pages/ContactUs'
import Login from './Components/Login'
import Signup from './Components/Signup'
import CourseDetail from './Pages/CourseDetail'
import { UserProvider } from './Context/UserContext'
import User from './Pages/User'
import Courses from './Pages/Courses'
import Quizzes from './Pages/Quizzes'
import Resources from './Pages/Resources'


function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/contact" element={<ContactUs />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path='/register' element={<Signup />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path='/user' element={<User/>}></Route>
            <Route path='/courses' element={<Courses/>}></Route>
            <Route path='/coursedetails/:id' element={<CourseDetail />}></Route>
            <Route path='/quizzes' element= {<Quizzes/>}></Route>
            <Route path='/resources' element={<Resources/>}></Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
