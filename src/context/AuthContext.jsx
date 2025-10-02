import { createContext, useState, useContext, useEffect } from "react";

// 1. Create context
const AuthContext = createContext();

// 2. Create provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const login = (username) => {
    const loggedUser = {
      name: username,
      role: `${username}`.toLowerCase() === "admin" ? 2 : 1,
    };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoadingAuth(false)
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{isLoadingAuth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook for easy usage
export function useAuth() {
  return useContext(AuthContext);
}
