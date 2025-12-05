import { Router } from "express";
import { userControllers } from "./user.controllers";
import chk from "../../middlware/chk";

const router = Router();
router.get("/", chk("admin"), userControllers.getAllUser);
router.put("/:id", chk("customer", "admin"), userControllers.updateUser);
export default router;
