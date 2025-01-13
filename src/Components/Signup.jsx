import { Link } from "react-router-dom"
import { useState } from "react";
import axios from "axios";

function Signup() {

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    try {
      // Send form data to the local json-server
      const response = await axios.post('http://localhost:3000/users', formData);

      // Handle success (e.g., show a success message, redirect, etc.)
      console.log('User data submitted:', response.data);
      alert('User signed up successfully!');
      setFormData({
        email:"",
        username:"",
        password:"",
      })
    } catch (error) {
      // Handle error
      console.error('There was an error submitting the form!', error);
      alert('Error signing up!');
    }
  };

  return (
 <>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 w-full bg-custom-bg bg-center bg-cover">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-custom-blue shadow-2xl w-full h-full rounded-3xl absolute transform -rotate-6"></div>
          <div className="card bg-custom-orange shadow-2xl w-full h-full rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            <label htmlFor="login" className="block mt-3 text-xl text-gray-700 text-center font-semibold">
              Sign up
            </label>
            <form onSubmit={handleSubmit} className="mt-10">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-4 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 mb-6"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-4 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 mb-6"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-4 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                  required
                />
              </div>
              <div className="mt-7">
                <button
                  type="submit"
                  className="bg-blue-500 w-fit py-2 px-5 flex justify-center mx-auto rounded-3xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                >
                  Sign up
                </button>
              </div>

              <div className="mt-7 text-sm">
                <div className="flex justify-center">
                  <label className="mr-2">Have an account?</label>
                  <Link to="/login">
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
