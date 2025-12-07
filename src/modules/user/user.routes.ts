import { Router } from "express";
import { userControllers } from "./user.controllers";
import chk from "../../middlware/chk";
import { Roles } from "../auth/auth.constant";

const router = Router();
router.get("/", chk(Roles.admin), userControllers.getAllUser);
router.put(
  "/:id",
  chk(Roles.customer, Roles.admin),
  userControllers.updateUser
);
router.delete("/:id", chk(Roles.admin), userControllers.deleteUser);
export default router;
