// import { Router } from "express";
const router = Router();
import { Router,type Request,type Response } from "express";
import { zStudentPutBody,zStudentPostBody,zStudentDeleteBody, zStudentId } from "../schemas/studentValidator.js";
import { courses, students } from "../db/db.js";
import { success } from "zod";

router.get("/:studentId/courses",(req:Request,res:Response) => {
  const studentId = req.params.studentId;
  const val_student = zStudentId.safeParse(studentId);

  console.log(studentId);

  try{

    if(!val_student.success){
    return res.status(400).json({
        message: "Validation failed",
        errors: val_student.error.issues[0]?.message,
      });
  }

  const foundIndex = students.findIndex(
      (student) => student.studentId === studentId
    );

  console.log(foundIndex);
  if(foundIndex == -1){
    return res.status(404).json({
        success: false,
        message: "Student does not exists",
      });
  }

  const respondcourse = students[foundIndex]?.courses?.map((course) => {
        const enrolledcourse = courses.find((enroll) => enroll.courseId == course);
        return {
            courseId: enrolledcourse?.courseId,
            courseTitle: enrolledcourse?.courseTitle
        }
    })

  return res.status(200).json({
    success: true,
    message:`Get courses detail of student ${studentId}`,
    data:{
      studentId:studentId,
      courses: respondcourse
    }

  })



  }catch(err){
    return res.status(400).json({
      success:false,
      message:"something is wromg, please try again",
      error:err
    })
  }


});

export default router;
