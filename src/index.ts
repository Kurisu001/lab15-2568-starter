import express,{response, type Request ,type Response } from "express";
import morgan from 'morgan';

//import val
// import { zStudentPostBody } from "./schemas/studentValidator.js";
import studentRouter from "./routes/studentRoutes.js"
import courseRouter from "./routes/courseRoutes.js"

//import database
import { students,courses } from "./db/db.js";
import type { Student } from "./libs/types.js";
import { success } from "zod";

const app: any = express();
const port = 3000;

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get('/me',(req:Request,res:Response) => {
  return res.status(200).json({
    success:true,
    message:"Student Infomation",
    data: students[0]
  })
});

app.get('/',(req:Request,res:Response) => {
  return res.status(404)
  .send("lab 15 API service successfully [Dev by shadow Kittipong]")
});

app.use("/api/v2/students",studentRouter);
app.use("/api/v2/courses",courseRouter);



app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;

