import { createContext, useState, useContext, useEffect } from "react";

// Create the context
const UserContext = createContext();

// Custom hook to use the context easily
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to register a new user
  const register = async (userData) => {
    const response = await fetch("http://localhost:5000/users", {
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
  const login = async ({ email, password }) => {
    const response = await fetch(`http://localhost:5000/users?email=${email}`);
    const users = await response.json();

    if (users.length > 0 && users[0].password === password) {
      setUser(users[0]);
      localStorage.setItem("user", JSON.stringify(users[0])); // Persist user info
    } else {
      alert("Invalid credentials");
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
