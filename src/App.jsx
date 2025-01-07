
import '/src/index.css'
import { BrowserRouter, Route , Routes} from 'react-router-dom'
import Home from '../src/Pages/Home'
import Dashboard from '../src/Pages/Dashboard'
import Form1 from '../src/Pages/Form1'
import Form2 from '../src/Pages//Form2'
import Form3 from '../src/Pages/Form3'
import Form4 from '../src/Pages/Form4'
import ContactUs from '../src/Pages/ContactUs'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}></Route>
      <Route path = "/dashboard" element = {<Dashboard/>}></Route>
      <Route path="/contact" element = {<ContactUs/>}></Route>
            <Route path="/form1" element={<Form1 />} />
            <Route path="/form2" element={<Form2 />} />
            <Route path="/form3" element={<Form3 />} />
            <Route path="/form4" element={<Form4 />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
