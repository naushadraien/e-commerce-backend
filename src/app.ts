import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes.js";
import "dotenv/config";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

const port = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);
const app = express();
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("api working on /api/v1");
});
app.use("/api/v1/auth", userRoutes);
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
