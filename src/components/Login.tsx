import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { login, logout } from "../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../store";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  useEffect(() => {
    dispatch(logout());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <Link to="/registration">Registration</Link>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {authState.error && <p>{authState.error}</p>}
      {authState.access && <p>Access Token: {authState.access}</p>}
      {authState.refresh && <p>Refresh Token: {authState.refresh}</p>}
    </div>
  );
};

export default Login;
