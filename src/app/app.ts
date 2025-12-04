import express, { Request, Response } from "express";
import initDb from "../config/db";

const app = express();
app.use(express.json());
initDb();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use((req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
