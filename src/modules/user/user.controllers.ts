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
const updateUser = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;
    const result = await userServices.updteUser(
      req.body as Record<string, any>,
      loggedInUser as Record<string, any>,
      req.params.id as string
    );
    if (result.rows.length === 0) {
      res.status(403).json({
        success: false,
        message: "you are not authorized to update this user",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const userControllers = { getAllUser, updateUser, deleteUser };
