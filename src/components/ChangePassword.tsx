import React, { useState } from "react";
import { useSelector } from "react-redux";
import { changePassword } from "../slices/authSlice";
import { RootState, useAppDispatch } from "../store";

const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const error = useSelector((state: RootState) => state.auth.error);
  const changePasswordSuccess = useSelector(
    (state: RootState) => state.auth.changePasswordSuccess
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      changePassword({
        old_password: oldPassword,
        password: newPassword,
        confirmed_password: confirmedPassword,
      })
    );
  };

  return (
    <div>
      <h2>Изменить пароль</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Старый пароль:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Новый пароль:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Подтверждение пароля:</label>
          <input
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Изменить пароль</button>
      </form>

      {error && <p style={{ color: "red" }}>{JSON.stringify(error)}</p>}
      {changePasswordSuccess && (
        <p style={{ color: "green" }}>Пароль успешно изменён!</p>
      )}
    </div>
  );
};

export default ChangePassword;
