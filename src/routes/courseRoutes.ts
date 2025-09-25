import { Router } from "express";
import express, { type Request, type Response } from "express";
const router: Router = Router();
import {
  zCourseId,
  zCoursePostBody,
  zCourseDeleteBody,
  zCoursePutBody,
} from "../schemas/courseValidator.js";
import { courses } from "../db/db.js";
import { success } from "zod";
import type { Course } from "../libs/types.js";
import { fail } from "assert";
import { error } from "console";

// READ all
router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Courses Infomation",
    data: courses,
  });
});

// Params URL
router.get("/:courseId", (req: Request, res: Response) => {
  //get value from get request and validate value
  const courseId = req.params.courseId;
  const val_courses = zCourseId.safeParse(Number(courseId));
  //console.log(req.params);
  //check vaildate success?
  try {
    if (!val_courses.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: val_courses.error.issues[0]?.message,
      });
    }
    //if pass vaildate check that info in the data base?
    const foundIndex = courses.findIndex(
      (course) => course.courseId === Number(courseId)
    );
    //if it not return 404 status
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exists",
      });
    }
    return res.json({
      success: true,
      message: `Get crouses ${courseId} successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.post("/", (req: Request, res: Response) => {
  const body = req.body as Course;
  const val_course = zCoursePostBody.safeParse(body);
  try {
    if (!val_course.success) {
      return res.status(400).json({
        success: false,
        message: "Nunber must be exactly 6 digit",
        errors: val_course.error.issues[0]?.message,
      });
    }
    //check that course is already exist?
    const foundIndex = courses.findIndex(
      (course) => course.courseId === body.courseId
    );
    //  console.log(foundIndex);

    if (foundIndex > -1) {
      return res.status(409).json({
        success: false,
        message: "Coures Id already exist",
      });
    }
    courses.push(body);

    return res.status(201).json({
      success: true,
      message: `Crouse ${body.courseId} has been added successfully`,
      data: body,
    });
    
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "something is wromg, please try again",
      error: err,
    });
  }
});

router.put("/", (req: Request, res: Response) => {
  const body = req.body as Course;
  const val_course = zCoursePutBody.safeParse(body);

  try {
    if (!val_course.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }
    const foundIndex = courses.findIndex(
      (course) => course.courseId === body.courseId
    );
    if (foundIndex == -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }
    if (courses[foundIndex]) {
      courses[foundIndex].courseTitle = body.courseTitle;
      courses[foundIndex].instructors = body.instructors;
    }

    return res.status(200).json({
      success: true,
      message: `course ${courses[foundIndex]} has been updated successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

router.delete("/", (req: Request, res: Response) => {
  const body = req.body;
  const result = zCourseDeleteBody.safeParse(body);
  const courseId = req.body?.courseId;

  // console.log(typeof courseId)
  console.log(courseId);

  try {
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }
    const foundIndex = courses.findIndex(
      (course: Course) => course.courseId === body.courseId
    );

    if (foundIndex == -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exists",
      });
    }
    courses.splice(foundIndex,1)

    return res.status(204).json({});
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

export default router;
