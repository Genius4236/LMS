import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import courseReducer from "./courseSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
  },
});

export default store;
