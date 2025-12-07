import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user as Record<string, any>;
    const result = (await bookingServices.getAllBookings(id, role)) as Record<
      string,
      any
    >;
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const bookingUpdate = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user as Record<string, any>;
    const bookingId = req.params.bookingId as string;
    const result = await bookingServices.bookingUpdate(
      bookingId,
      role,
      id,
      req.body.status
    );

    const statusType = req.body.status;
    const message =
      statusType === "returned"
        ? "Booking returned successfully"
        : "Booking cancelled successfully";

    res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  bookingUpdate,
};
