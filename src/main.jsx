// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContexts"; 
import { BrowserRouter } from 'react-router-dom';
// --- ¡NUEVO! ---
import { GoogleOAuthProvider } from '@react-oauth/google';

// Esta es la ÚNICA variable que necesitas del lado del cliente
const GOOGLE_CLIENT_ID = "49601852139-e9j9phauklg852t5nlub7gvh5sg37tq6.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* --- ¡NUEVO! --- */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
      {/* --- FIN DE LO NUEVO --- */}
    </BrowserRouter>
  </StrictMode>
);