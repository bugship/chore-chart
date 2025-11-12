/**
 * AuthContext — holds the JWT in React state and mirrors it to localStorage
 * so sessions survive page reloads.
 */
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Hydrate from localStorage on first render (null if logged out).
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Keep storage in sync whenever token changes (login, register, logout).
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
