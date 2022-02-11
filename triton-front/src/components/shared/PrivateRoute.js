import { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/agent";

export default function PrivateRoute({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function authorizeUser() {
    const res = await axios.get(`${BASE_URL}/account/currentUser`);

    setCurrentUser(res.data);
    setIsLoggedIn(true);
  }

  useEffect(() => {
    if (!isLoggedIn)
      authorizeUser()
        .then(() => setLoading(false))
        .catch(() => {
          setLoading(false);
          setIsLoggedIn(false);
          navigate("/login");
        });
  }, []);

  if (loading) return null;

  return isLoggedIn ? children : <Navigate to="/login" />;
}
