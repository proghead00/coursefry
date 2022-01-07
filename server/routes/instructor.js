import express from "express";

const router = express.Router();

import { requireSignin } from "../middlewares";

// controllers
import {
  makeInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
  studentCount,
  instructorBalance,
  //   instructorPayoutSettings,
} from "../controllers/instructor";

router.post("/make-instructor", requireSignin, makeInstructor);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.get("/current-instructor", requireSignin, currentInstructor);

router.get("/instructor-courses", requireSignin, instructorCourses);

router.post("/instructor/student-count", requireSignin, studentCount);

router.get("/instructor/balance", requireSignin, instructorBalance);

// router.get(
//   "/instructor/payout-settings",
//   requireSignin,
//   instructorPayoutSettings
// );

module.exports = router;
