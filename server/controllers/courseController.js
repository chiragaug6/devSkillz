import Course from "../models/courseModel.js";
import AppError from "../utils/error.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */
export const getAllCourses = async (req, res, next) => {
  try {
    // Find all the courses without lectures
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      succes: true,
      message: "All courses",
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * @GET_LECTURES_BY_COURSE_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private(ADMIN, subscribed users only)
 */
export const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id or course not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "temp public_id",
      secure_url: "temp secure_url",
    },
  });

  if (!course) {
    return next(new AppError("Coures Creation failed,try Again", 500));
  }

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "LMS",
    });

    if (result) {
      course.thumbnail.public_id = result.public_id;
      course.thumbnail.secure_url = result.secure_url;
    }

    fs.rm(`uploads/${req.file.filename}`);
  }

  await course.save();

  res.status(201).json({
    succes: true,
    message: "coures created succssfully",
    course,
  });
};

export const updateCoures = async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  const course = await Course.findByIdAndUpdate(
    id,
    { $set: req.body },
    { runValidators: true, new: true }
  );

  console.log("updated coures>", course);

  if (!course) {
    return next(new AppError("Coures With given id does not exits", 404));
  }

  await course.save();

  res.status(200).json({
    succes: true,
    message: "coures updated succssfully",
    course,
  });
};

export const deleteCoures = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coures = await Course.findByIdAndDelete(id);

    if (!coures) {
      return next(new AppError("Coures With given id does not exits", 404));
    }

    res.status(201).json({
      succes: true,
      message: "coures deleted succssfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// export const addLectureToCouresById = async (req, res, next) => {
//   const { title, description } = req.body;
//   const { id } = req.params;

//   const coures = await Course.findById(id);

//   if (!coures) {
//     return next(new AppError("Coures with given id does not exits", 500));
//   }
// };
