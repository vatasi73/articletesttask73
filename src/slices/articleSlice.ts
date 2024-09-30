// Добавляем необходимые импорты
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AuthState } from "./authSlice";

export interface Article {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  title: string;
  slug: string;
  content: string;
  created: string;
  updated: string;
  image: string | undefined;
}

export interface Comment {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  content: string;
  created: string;
  updated: string;
  article: number;
  parent: number | null;
  children: Comment[];
}

interface ArticleState {
  articles: Article[];
  comments: Comment[];
  error: string | null;
  loading: boolean;
}

const initialState: ArticleState = {
  articles: [],
  comments: [],
  error: null,
  loading: false,
};

// Async thunk для получения статей
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async () => {
    const response = await axios.get(
      "https://darkdes-django-t3b02.tw1.ru/api/v1/articles/"
    );
    return response.data;
  }
);

// Async thunk для добавления статьи
export const addArticle = createAsyncThunk(
  "articles/addArticle",
  async (articleData: FormData, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      const response = await axios.post(
        "https://darkdes-django-t3b02.tw1.ru/api/v1/articles/",
        articleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

// Async thunk для получения комментариев к статье
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (articleId: number) => {
    const response = await axios.get(
      `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${articleId}/comments/`
    );
    return response.data;
  }
);

// Async thunk для редактирования статьи
export const editArticle = createAsyncThunk(
  "articles/editArticle",
  async (
    {
      id,
      articleData,
    }: {
      id: number;
      articleData: FormData;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      const response = await axios.put(
        `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}/`,
        articleData,
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

// Async thunk для удаления статьи
export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id: number, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      await axios.delete(
        `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return id; // Возвращаем id удаленной статьи
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "Неизвестная ошибка"
      );
    }
  }
);

// Async thunk для добавления комментария к статье
export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    {
      articleId,
      content,
      parent,
    }: { articleId: number; content: string; parent: number | null },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      const response = await axios.post(
        `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${articleId}/comments/`,
        { content, parent },
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

export const editComment = createAsyncThunk(
  "comments/editComment",
  async (
    {
      articleId,
      commentId,
      content,
    }: {
      articleId: number;
      commentId: number;
      content: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      const response = await axios.put(
        `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${articleId}/comments/${commentId}/`,
        { content },
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

// Async thunk для удаления комментария
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (
    { articleId, commentId }: { articleId: number; commentId: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      await axios.delete(
        `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${articleId}/comments/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return commentId; // Возвращаем id удаленного комментария
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "Неизвестная ошибка"
      );
    }
  }
);

export const addReply = createAsyncThunk(
  "comments/addReply",
  async (
    {
      articleId,
      commentId,
      content,
    }: { articleId: number; commentId: number; content: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.access;

    try {
      const response = await axios.post(
        `https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${articleId}/comments/`,
        { content, parent: commentId }, // Родительский комментарий
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { ...response.data, children: [] };
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "Неизвестная ошибка"
      );
    }
  }
);

// Слайс для статей
const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.error = action.error.message || "Ошибка получения статей";
      })
      .addCase(addArticle.fulfilled, (state, action) => {
        state.articles.unshift(action.payload);
        state.error = null;
      })
      .addCase(addArticle.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(editArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(
          (article) => article.id === action.payload.id
        );
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(editArticle.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(
          (article) => article.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.error.message || "Ошибка получения комментариев";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(editComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addReply.fulfilled, (state, action) => {
        // Находим родительский комментарий, к которому мы добавляем ответ
        const parentComment = state.comments.find(
          (comment) => comment.id === action.payload.parent
        );
        if (parentComment) {
          parentComment.children.push(action.payload); // Добавляем новый ответ как дочерний комментарий
        }
        state.error = null;
      });
  },
});

export const articlesReducer = articlesSlice.reducer;
