import { Router } from "express";
import express from "express";
import { bookingControllers } from "./booking.controllers";
import chk from "../../middlware/chk";

const router = Router();

// Ensure JSON parsing
router.use(express.json());

router.post("/", chk("customer"), bookingControllers.createBooking);
router.get("/", chk("admin", "customer"), bookingControllers.getAllBookings);
router.put(
  "/:bookingId",
  chk("admin", "customer"),
  bookingControllers.bookingUpdate
);

export default router;
/*


{
  "name": "abc",
  "email": "abc@",
  "password": "abc",
  "phone": "01712345678",
  "role": "admin"


  {
  "name": "123",
  "email": "123@",
  "password": "123",
  "phone": "01712345678",
  "role": "customer"
}
*/
