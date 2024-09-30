import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface AuthState {
  access: string | null;
  refresh: string | null;
  error: string | null;
  changePasswordSuccess: boolean | null;
  registrationSuccess: boolean | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  error: null,
  changePasswordSuccess: null,
  registrationSuccess: null,
  isAuthenticated: !!localStorage.getItem("access"),
};

// Async thunk для авторизации
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await axios.post(
      "https://darkdes-django-t3b02.tw1.ru/api/v1/token/",
      credentials
    );
    return response.data;
  }
);

// Async thunk для обновления токена
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string) => {
    const response = await axios.post(
      "https://darkdes-django-t3b02.tw1.ru/api/v1/token/refresh/",
      { refresh: refreshToken }
    );
    return response.data;
  }
);

// Async thunk для изменения пароля
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    passwordData: {
      old_password: string;
      password: string;
      confirmed_password: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      const response = await axios.put(
        "https://darkdes-django-t3b02.tw1.ru/api/v1/change-password/",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "Неизвестная ошибка"
      );
    }
  }
);

// Async thunk для регистрации
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
      username: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://darkdes-django-t3b02.tw1.ru/api/v1/registration/",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "Неизвестная ошибка"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  return;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.error = null;
        state.isAuthenticated = true;
        localStorage.setItem("access", action.payload.access);
        localStorage.setItem("refresh", action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message || "Ошибка авторизации";
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.access = action.payload.access; // Обновляем токен доступа
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.error.message || "Ошибка обновления токена";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordSuccess = true; // Успешное изменение пароля
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(register.fulfilled, (state) => {
        state.registrationSuccess = true; // Успешная регистрация
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        // При выходе очищаем токены и другие состояния
        state.access = null;
        state.refresh = null;
        state.error = null;
        state.changePasswordSuccess = null;
        state.registrationSuccess = null;
        state.isAuthenticated = false;
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      });
  },
});

export const authReducer = authSlice.reducer;
