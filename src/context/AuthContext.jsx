import { createContext, useState, useContext, useEffect } from "react";
import Assist from "../classes/assist";

// 1. Create context
const AuthContext = createContext();

// 2. Create provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    const details = Assist.getTokenDetails(token);

    //the sign-in itself is recorded by the server
    setUser(details);
  };

  // Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const details = Assist.getTokenDetails(token);

    if (token) {
      const now = Date.now() / 1000;
      if (details.exp < now) {
        setUser(null);
        endSession(details, 'Expired')
      } else {
        setUser(details);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const logout = (details) => {
    setUser(null);
    //the token is removed once the sign-out is recorded (it identifies the person)
    const token = localStorage.getItem("token");
    const forget = () => {
      if (localStorage.getItem("token") === token) localStorage.removeItem("token");
    };
    endSession(details, 'Logout').then(forget, forget);
  };

  const endSession = (details, reason) => {
    return Assist.auditAction(
      details.userid,
      details.sub,
      details.jti,
      "Session",
      null,
      `End - ${reason}`,
      null,
      details,
    );
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
