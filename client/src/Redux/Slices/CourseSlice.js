import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import { toast } from "react-hot-toast";

const initialState = {
  courseData: [],
};

export const getAllCourses = createAsyncThunk("/course/get", async () => {
  const loadingMessage = toast.loading("fetching courses! ...");
  try {
    const res = await axiosInstance.get("/courses");
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.message, { id: loadingMessage });
  }
});

export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
  const loadingMessage = toast.loading("deleting course! ...");
  try {
    const res = await axiosInstance.delete(`/courses/${id}`);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.message, { id: loadingMessage });
  }
});

export const createNewCourse = createAsyncThunk(
  "/course/create",
  async (data) => {
    const loadingMessage = toast.loading("creating New course! ...");
    try {
      let formData = new FormData();
      formData.append("title", data?.title);
      formData.append("description", data?.description);
      formData.append("category", data?.category);
      formData.append("createdBy", data?.createdBy);
      formData.append("thumbnail", data?.thumbnail);

      const res = await axiosInstance.post("/courses", formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      if (action?.payload) {
        state.courseData = action?.payload?.courses;
      }
    });
  },
});

export default courseSlice.reducer;
