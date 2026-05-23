import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    currentCourse: null,
    progress: null,
    loading: false,
    error: null,
  },
  reducers: {
    courseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchCourseDetailsSuccess: (state, action) => {
      state.loading = false;
      state.currentCourse = action.payload;
    },
    fetchProgressSuccess: (state, action) => {
      state.loading = false;
      state.progress = action.payload;
    },
    updateProgressSuccess: (state, action) => {
      state.progress = action.payload;
    },
    courseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.progress = null;
    },
  },
});

export const {
  courseStart,
  fetchCoursesSuccess,
  fetchCourseDetailsSuccess,
  fetchProgressSuccess,
  updateProgressSuccess,
  courseFailure,
  clearCurrentCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
