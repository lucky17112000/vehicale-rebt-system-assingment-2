import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

//authConstant theke role ghula load korte hobe neverthless banan vhul hote pare debuging eta dekte hobe

const chk = (...roles: ("admin" | "customer")[]) => {
  //barear er jinista notun sikhlam full test korte hobe debuging er smy
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      let token = authHeader;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }

      // let token = "";
      // for (let i = splited.length - 1; splited[i] === " "; --i) {
      //   splited += token[i];
      // }
      // token.reverse();

      const decodedToken = jwt.verify(token, config.jwtSecret as string);
      //   console.log(decodedToken);
      req.user = decodedToken as JwtPayload;
      //   console.log("cholo deki set hoise ki na: ", req.user);
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
