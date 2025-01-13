import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

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
      // Check if user with the given username exists in db.json
      const response = await axios.get(`http://localhost:3000/users?username=${formData.username}`);

      // Check if the response contains any users and validate password
      if (response.data.length > 0) {
        const user = response.data[0];

        // Check if the password matches
        if (user.password === formData.password) {
          console.log('Login successful:', user);
          alert('Login successful!');
          // Redirect to dashboard or home page after login success
          navigate('/dashboard');
          setFormData({
            username: '',
            password: '',
          })
        } else {
          alert('Incorrect password');
        }
      } else {
        alert('User not found');
        setFormData({
          username: '',
          password: '',
        })
      }
    } catch (error) {
      // Handle error
      console.error('There was an error logging in!', error);
      alert('Error logging in!');
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 w-full bg-custom-bg bg-center bg-cover bg-opacity-50">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-custom-blue shadow-2xl w-full h-full rounded-3xl absolute transform -rotate-6"></div>
          <div className="card bg-custom-orange shadow-2xl w-full h-full rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            <label
              htmlFor="login"
              className="block mt-3 text-xl text-gray-700 text-center font-semibold"
            >
              Login
            </label>
            <form onSubmit={handleSubmit} className="mt-10">
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
                  Login
                </button>
              </div>

              <div className="mt-7 text-sm">
                <div className="flex justify-center">
                  <label className="mr-2">Don&apos;t have an account?</label>
                  <Link to="/register">
                    <h
                      className="text-black transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                    >
                      Create an account
                    </h>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
