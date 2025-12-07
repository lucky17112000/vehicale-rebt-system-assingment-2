import { Router } from "express";
import express from "express";
import { bookingControllers } from "./booking.controllers";
import chk from "../../middlware/chk";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.use(express.json());

router.post(
  "/",
  chk(Roles.customer, Roles.admin),
  bookingControllers.createBooking
);
router.get(
  "/",
  chk(Roles.admin, Roles.customer),
  bookingControllers.getAllBookings
);
router.put(
  "/:bookingId",
  chk(Roles.admin, Roles.customer),
  bookingControllers.bookingUpdate
);

export default router;
