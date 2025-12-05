import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import chk from "../../middlware/chk";

const router = Router();
router.post("/", chk("admin"), vehiclesControllers.createVehicles);
router.get("/", vehiclesControllers.getAllvehicles);
router.get("/:vehicleId", vehiclesControllers.getSingleVehicles);
router.put("/:vehicleId", chk("admin"), vehiclesControllers.updateVehicles);
router.delete("/:vehicleId", chk("admin"), vehiclesControllers.deleteVehicles);

export default router;
