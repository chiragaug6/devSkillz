import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/AuthSlice.js";
import courseSliceReducer from "./Slices/CourseSlice.js";
import razorpaySliceReducer from "./Slices/RazorpaySlice.js";
import lectureSliceReducer from "./Slices/LectureSlice.js";
import statSliceReducer from "./Slices/StatSlice.js";
import testSliceReducer from "./Slices/TestSlice.js";
import commentSlice from "./Slices/CommentSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course: courseSliceReducer,
    razorpay: razorpaySliceReducer,
    lecture: lectureSliceReducer,
    stat: statSliceReducer,
    test: testSliceReducer,
    comment: commentSlice,
  },
  devTools: true,
});

export default store;
