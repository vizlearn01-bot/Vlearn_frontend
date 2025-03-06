import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "../Context/UserProvider";
import Wave from "react-wavify"; // Import react-wavify

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      console.log("Login successful:", result.user);
      successAlert();
      setFormData({ username: "", password: "" });
    } else {
      failureAlert(result.message);
    }
  };

  const successAlert = () => {
    Swal.fire({
      title: "Success",
      text: "Login successful",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/");
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

  // Wave Function
  const renderWave = (position) => (
    <Wave
      className={`absolute ${position} left-0 w-full`}
      fill="#005f6a"
      options={{
        height: 65,  // Wave height
        amplitude: 10, // Wave curves
        speed: 1,  // Animation speed
        points: 10,   // Number of wave points
      }}
    />
  );

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
                    <h className="text-black transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                      Create an account
                    </h>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Wave */}
        {renderWave("bottom-0")}

      </div>
    </>
  );
}

export default Login;
