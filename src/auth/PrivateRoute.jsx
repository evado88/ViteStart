import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { LoadingApp } from "../components/LoadingApp";

export default function PrivateRoute({ children }) {
  const { isLoadingAuth, user } = useAuth();

  if (isLoadingAuth) {
    return <LoadingApp/>; // Or a more sophisticated loading component
  } else {
    if (!user) {
      return <Navigate to="/login" replace />;
    } else {
      return children;
    }
  }
}
