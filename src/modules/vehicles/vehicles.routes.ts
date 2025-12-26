import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { auth } from "../../middleware/auth";
import { access } from "../../middleware/role";

const router = Router();

router.post("/", auth,access("customer"),vehiclesController.getVehicles);

export const vehiclesRouter = router;
