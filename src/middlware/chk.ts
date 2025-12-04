import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const chk = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      //   console.log("token vaia", token);
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const decodedToken = jwt.verify(token, config.jwtSecret as string);
      //   console.log(decodedToken);
      req.user = decodedToken as JwtPayload;
      //   console.log("cholod deki set hoise ki na: ", req.user);
      if (
        roles.length > 0 &&
        !roles.includes(req.user.role as "admin" | "customer")
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access forbidden for your role" });
      }

      next();
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
};
export default chk;
