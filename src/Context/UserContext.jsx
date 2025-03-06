import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import BASE_URL from "../config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      const storedToken = JSON.parse(localStorage.getItem("token"));
      return storedToken || null;
    } catch (error) {
      console.error("Error parsing token from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token?.access) return;
  
      try {
        const decodedUser = jwtDecode(token.access); // Decode the JWT
        const response = await fetch(`${BASE_URL}/profile/`, {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
  
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Set the user data in the context
        } else {
          console.error("Failed to fetch user profile:", response.status);
          logout();
        }
      } catch (error) {
        console.error("Error decoding token or fetching user profile:", error);
        logout();
      }
    };
  
    fetchUserProfile();
  }, [token]);

  const login = (authToken) => {
    try {
      const decodedUser = jwtDecode(authToken.access); // Extract user info
      setUser(decodedUser);
      setToken(authToken);
      localStorage.setItem("token", JSON.stringify(authToken)); // Store token persistently
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token"); // Remove token from storage
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;