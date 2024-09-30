import React, { useState } from "react";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../store"; // Импортируйте тип RootState, если он у вас настроен
import { register } from "../slices/authSlice";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const error = useSelector((state: RootState) => state.auth.error);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link to="/login">Login</Link>

      <div>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Логин:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Электронная почта:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="first_name">Имя:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="last_name">Фамилия:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      </div>
    </div>
  );
};

export default Register;
