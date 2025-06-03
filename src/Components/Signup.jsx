import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../config";
import { Mail, Lock, ArrowRight, User } from 'lucide-react';


function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/register/`, formData);
      if (response.status === 201) {
        successAlert();
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);

      let errorMessage = "An error occurred. Please try again."; // Default error message

      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = Object.values(errorData).flat().join("\n"); // Extract error messages
      }

      failureAlert(errorMessage);
    }
  };




  const successAlert = () => {
    Swal.fire({
      title: "Success",
      text: "Registration successful",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const failureAlert = (message) => {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  };



  return (
    <>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 w-full bg-custom-bg bg-center bg-cover">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 z-0"></div>


        <div className="relative sm:max-w-lg w-full md:mx-auto">
          <div className="card bg-custom-blue shadow-2xl w-full h-full rounded-3xl absolute transform -rotate-6"></div>
          <div className="card bg-custom-orange shadow-2xl w-full h-full rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            {/* Branding */}
            <div className="flex flex-col items-center justify-center z-10">
              <img src="/images/vlearn_logo.png" alt="Logo" className="h-32 w-auto" />
            </div>
            <label htmlFor="signup" className="block mb-3 text-xl text-gray-700 text-center font-semibold">
              Sign up
            </label>
            <p className="text-gray-600 text-sm text-center mb-4">Begin your science journey today</p>


            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <form onSubmit={handleSignup} className="space-y-10">
              <div>
                <label className="block mb-2 text-sm font-medium">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-3xl outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-3xl outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                    placeholder="First Name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-3xl outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-3xl outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-3xl outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center w-full mx-auto py-3 px-2 text-white bg-custom-blue rounded-3xl gap-2 hover:bg-custom-orange transition-colors"
              >
                Create account
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-center text-sm">
                Already have an account? <Link to="/login"
                  className="text-blue-600 hover:underline transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                >Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
