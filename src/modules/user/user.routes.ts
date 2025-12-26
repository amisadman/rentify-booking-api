import { Router } from "express";
import { auth } from "../../middleware/auth";
import { access } from "../../middleware/role";
import { userController } from "./user.controller";

const router = Router();

router.get("/",auth,access(["admin"]),userController.getAllUsers);
router.put("/:id", auth, access(["admin", "customer"]), userController.updateUser);


export const userRouter = router;
