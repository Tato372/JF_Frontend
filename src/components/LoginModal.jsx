// src/components/LoginModal.jsx
import { X, Github, Chrome } from "lucide-react";
// --- ¡NUEVO! ---
import { useGoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContexts";

const API_BASE_URL = "https://jf-api-prod-user-asfrcja6fnhsh9ec.eastus2-01.azurewebsites.net"; 
// Ya no necesitamos las URLs de login antiguas

export default function LoginModal({ isOpen, onClose, darkMode }) {
  // --- ¡NUEVO! ---
  const { login } = useContext(AuthContext); // Obtenemos la función 'login' del contexto

  // Esta función se conecta a nuestro NUEVO endpoint del backend
  const sendCodeToBackend = async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/exchange/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) {
        throw new Error('Fallo al intercambiar el código en el backend');
      }

      const data = await response.json(); // El backend nos devuelve { token: "..." }
      
      // ¡ÉXITO! Usamos la función de login del AuthContext
      login(data.token);
      onClose(); // Cerramos el modal

    } catch (error) {
      console.error("Error en sendCodeToBackend:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  // Esta es la función que llama el "popup" de Google
  const handleGoogleLogin = useGoogleLogin({
    // Este es el flujo que nos da un 'code'
    flow: 'auth-code',
    // Cuando Google nos da el 'code', llamamos a nuestra función
    onSuccess: (codeResponse) => {
      sendCodeToBackend(codeResponse.code);
    },
    onError: (error) => {
      console.error('Error en el login de Google:', error);
    }
  });
  // --- FIN DE LO NUEVO ---
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      {/* ... (El resto del modal es igual) ... */}
      <div
        className={`relative w-80 p-6 rounded-2xl shadow-xl transition-colors
          ${darkMode ? "bg-gray-900 text-white" : "bg-yellow-500 text-black"}
        `}
      >
        {/* ... (Cerrar, Título, etc. son iguales) ... */}
        <button onClick={onClose} className="absolute top-3 right-3 ..."><X/></button>
        <h2 className="text-xl font-bold">Iniciar Sesión</h2>

        {/* Botones */}
        <div className="flex flex-col space-y-3">
          <button
            // onClick={() => (window.location.href = GITHUB_LOGIN_URL)} (Deshabilitado por ahora)
            className={`flex items-center justify-center w-full ... (deshabilitado o sin cambiar)`}
          >
            <Github className="w-5 h-5 mr-2" />
            GitHub (Próximamente)
          </button>

          <button
            // --- ¡CAMBIO! ---
            onClick={() => handleGoogleLogin()} 
            className={`flex items-center justify-center w-full ...`}
          >
            <Chrome className="w-5 h-5 mr-2" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}