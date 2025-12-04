import { Request, Response } from "express";
import { userServices } from "./user.services";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllusers();
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const userControllers = { getAllUser };
