import { Link } from "react-router-dom"
import { useState } from "react";


function Signup() {

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  function handleChange(event){
    setFormData(event.target.value)
    console.log(event.target.value)
  }
  return (
          <>
            <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 w-full bg-custom-bg bg-center bg-cover">
              <div className="relative sm:max-w-sm w-full">
                <div className="card bg-custom-blue shadow-2xl w-full h-full rounded-3xl absolute transform -rotate-6"></div>
                <div className="card bg-custom-orange shadow-2xl w-full h-full rounded-3xl absolute transform rotate-6"></div>
                <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
                  <label
                    htmlFor="login"
                    className="block mt-3 text-xl text-gray-700 text-center font-semibold"
                  >
                    Sign up
                  </label>
                  <form className="mt-10">
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-4 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 mb-6"
                      />
                    </div>
                    <div>
                      <input 
                      type="text"
                      name="username"
                      placeholder="username"
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-4 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 mb-6"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-4 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                      />
                    </div>
      
      
                    <div className="mt-7">
                      <button
                        type="submit"
                        className="bg-blue-500 w-fit py-2 px-5 flex justify-center mx-auto rounded-3xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                      >
                        Login
                      </button>
                    </div>
      
                    <div className="flex mt-7 items-center text-center">
                      <hr className="border-gray-300 border-1 w-full rounded-md" />
                      <label className="block font-medium text-sm text-gray-600 w-full">
                        Or login with
                      </label>
                      <hr className="border-gray-300 border-1 w-full rounded-md" />
                    </div>
      
                    <div className="flex mt-7 justify-center w-full">
                      <button className="mr-5 bg-custom-blue border-none px-4 py-2 rounded-3xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                        Facebook
                      </button>
      
                      <button className="bg-custom-orange border-none px-4 py-2 rounded-3xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                        Google
                      </button>
                    </div>
      
                    <div className="mt-7 text-sm">
                      <div className="flex justify-center">
                        <label className="mr-2">Have an account?</label>
                    <Link to='/login'>
                    <h
                          className="text-black transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                        >
                          Sign in
                        </h>
                    </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
  )
}

export default Signup
