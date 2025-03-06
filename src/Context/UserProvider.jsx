import { createContext, useState, useContext, useEffect } from "react";
import BASE_URL from "../config";

// Create the context
const UserContext = createContext();

// Custom hook to use the context easily
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to register a new user
  const register = async (userData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const newUser = await response.json();
      login(newUser); // Log in the user after registration
    }
  };

  // Function to log in the user
  const login = async ({ username, password }) => {
    try {
      const response = await fetch(`http://localhost:3000/users?username=${username}`);
      const users = await response.json();

      if (users.length > 0) {
        const foundUser = users[0];

        if (foundUser.password === password) {
          setUser(foundUser);
          localStorage.setItem("user", JSON.stringify(foundUser)); // Persist user info
          return { success: true, user: foundUser };
        } else {
          return { success: false, message: "Incorrect password" };
        }
      } else {
        return { success: false, message: "User not found" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred. Try again later." };
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Check for user in localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
