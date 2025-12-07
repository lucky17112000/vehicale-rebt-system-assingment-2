import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import chk from "../../middlware/chk";
import { Roles } from "../auth/auth.constant";

const router = Router();
router.post("/", chk(Roles.admin), vehiclesControllers.createVehicles);
router.get("/", vehiclesControllers.getAllvehicles);
router.get("/:vehicleId", vehiclesControllers.getSingleVehicles);
router.put("/:vehicleId", chk(Roles.admin), vehiclesControllers.updateVehicles);
router.delete(
  "/:vehicleId",
  chk(Roles.admin),
  vehiclesControllers.deleteVehicles
);
export default router;
