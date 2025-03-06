
import '/src/index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../src/Pages/Home'
import Dashboard from './Pages/Dashboard'
import ContactUs from '../src/Pages/ContactUs'
import Login from './Components/Login'
import Signup from './Components/Signup'
import CourseDetail from './Pages/CourseDetail'
import { UserProvider } from './Context/UserContext'


function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/contact" element={<ContactUs />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path='/register' element={<Signup />}></Route>
            <Route path='/coursedetails/:id' element={<CourseDetail />}></Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
