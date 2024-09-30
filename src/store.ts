import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { articlesReducer } from "./slices/articleSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
  },
});

// Типы для использования в приложении
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
