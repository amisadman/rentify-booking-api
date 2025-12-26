import { Router } from "express";
import { auth } from "../../middleware/auth";
import { access } from "../../middleware/role";
import { userController } from "./user.controller";

const router = Router();

router.get("/",auth,access(["admin"]),userController.getAllUsers);


export const userRouter = router;
