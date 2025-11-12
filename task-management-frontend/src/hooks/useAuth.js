/**
 * useAuth — convenience hook for login, register, and logout flows.
 * Talks to VITE_API_URL (e.g. http://localhost:5001/api).
 */
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  /** Authenticate existing user; stores JWT and redirects to the task board. */
  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setToken(data.token);
      navigate("/");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /** Create account, store JWT, redirect home. */
  const register = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setToken(data.token);
      navigate("/");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /** Clear token and return to the login page. */
  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return { token, login, register, logout };
};
