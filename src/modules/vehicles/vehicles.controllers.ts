import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createVehicles(
      req.body as Record<string, any>
    );
    res.status(201).json({
      success: true,
      message: "Vehicle created succesfully",
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

const getAllvehicles = async (req: Request, res: Response) => {
  const result = await vehiclesServices.getAllVehicles();
  if (result.rows.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No vehicles found",
      data: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Vehicles retrieved successfully",
    data: result.rows,
  });
};

const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    // console.log("Requestedvehicle ID:", req.params.vehicleId);
    const result = await vehiclesServices.singleVehicles(
      req.params.vehicleId as string
    );
    // console.log("query result:", result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle Not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
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

const updateVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.updateVehicles(
      req.params.vehicleId as string,
      req.body as Record<string, any>
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle Not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
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

const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicles(
      req.params.vehicleId as string
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        sucess: false,
        message: "Vehicle Not found for deletion",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
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
export const vehiclesControllers = {
  createVehicles,
  getAllvehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
