import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { auth } from "../../middleware/auth";
import { access } from "../../middleware/role";

const router = Router();

router.post("/", auth, access(["admin"]), vehiclesController.createVehicle);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:id", vehiclesController.getVehiclesById);

export const vehiclesRouter = router;
