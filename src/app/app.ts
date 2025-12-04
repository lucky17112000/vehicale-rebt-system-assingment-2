import express, { Request, Response } from "express";
import initDb from "../config/db";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";

const app = express();
app.use(express.json());
initDb();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

// Register routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

//AT LAST WE HAVE TO HANDLE IT
app.use((req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
