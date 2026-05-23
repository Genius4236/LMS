import { createSlice } from "@reduxjs/toolkit";

const initialUser = localStorage.getItem("lms_user")
  ? JSON.parse(localStorage.getItem("lms_user"))
  : null;

const initialToken = localStorage.getItem("lms_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    token: initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem("lms_user", JSON.stringify(action.payload.user));
      if (action.payload.token) {
        localStorage.setItem("lms_token", action.payload.token);
      }
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("lms_user");
      localStorage.removeItem("lms_token");
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("lms_user", JSON.stringify(state.user));
    },
  },
});

export const { authStart, authSuccess, authFailure, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
