import { createContext, useState, useContext, useEffect } from "react";

// 1. Create context
const AuthContext = createContext();

// 2. Create provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username) => {
    const loggedUser = { name: username };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser({ name: username });
  };

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook for easy usage
export function useAuth() {
  return useContext(AuthContext);
}
