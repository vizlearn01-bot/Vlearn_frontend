import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../config";
import UserContext from "../Context/UserContext";
import {Lock, User} from "lucide-react"

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/login/`, formData);

      if (response.status === 200) {
        const token = response.data; // Extract token and user data
        login(token); // Store in context


        Swal.fire({
          title: "Success",
          text: "Login successful",
          icon: "success",
          confirmButtonText: "OK",
        });

        navigate("/dashboard/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.non_field_errors?.[0] || "Login failed. Please try again.";
      setError(errorMessage);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };



  return (
    <>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 w-full bg-custom-bg bg-center bg-cover bg-opacity-50">
        <div className="relative sm:max-w-lg w-full">
          <div className="card bg-custom-blue shadow-2xl w-full h-full rounded-3xl absolute transform -rotate-6"></div>
          <div className="card bg-custom-orange shadow-2xl w-full h-full rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            <label
              htmlFor="login"
              className="block mt-3 text-xl text-gray-700 text-center font-semibold"
            >
              Login
            </label>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <form onSubmit={handleLogin} className="mt-10">
              <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-4 pl-10 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 mb-6"
                  required
                />
              </div>

              <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-4 pl-10 border-none bg-gray-100 h-11 rounded-3xl shadow-2xl hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
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
                    <span className="text-black transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                      Create an account
                    </span>
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
