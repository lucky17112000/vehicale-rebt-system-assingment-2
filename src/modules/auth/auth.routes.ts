import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router();
router.post("/signup", authControllers.signUp);
router.post("/signin", authControllers.login);
export default router;
