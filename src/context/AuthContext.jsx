import { createContext, useState, useContext, useEffect } from "react";
import Assist from "../classes/assist";

// 1. Create context
const AuthContext = createContext();

// 2. Create provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const login = (username) => {
    const loggedUser = {
      name: `${username}`.substring(0, 5),
      role: `${username}`.toLowerCase() === "admin" ? 2 : 1,
    };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("token", JSON.stringify(username));
    const details = Assist.getTokenDetails(username);
    console.log("a-detail", details, "stored user", username);

    setUser(details);
  };

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const details = Assist.getTokenDetails(token);
    console.log("b-detail", details, "stored user", storedUser);

    if (storedUser) {
      const now = Date.now() / 1000;
      if (details.exp < now) {
        setUser(null);
      } else {
        setUser(details);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoadingAuth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook for easy usage
export function useAuth() {
  return useContext(AuthContext);
}
