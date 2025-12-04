import { Router } from "express";
import { userControllers } from "./user.controllers";
import chk from "../../middlware/chk";

const router = Router();
router.get("/", chk("admin", "customer"), userControllers.getAllUser);
export default router;
