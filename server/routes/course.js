import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { isInstructor, requireSignin, isEnrolled } from "../middlewares";

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
  paidEnrollment,
  stripeSuccess,
  userCourses,
  markCompleted,
  listCompleted,
  markIncomplete,
} from "../controllers/course";

router.get("/courses", courses);

//image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);

// course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);

// video
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo,
  addLesson
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

// publish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

// lesson
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

// enrollment
router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);

router.get("/stripe-success/:courseId", requireSignin, stripeSuccess);

router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read); // if user has enrolled

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/list-completed", requireSignin, listCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);

module.exports = router;
