import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ShoppingProvider } from "./context/ShoppingBasketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ShoppingProvider>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </ShoppingProvider>
  </StrictMode>
);
