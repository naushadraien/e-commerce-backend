import express from "express";
import { loggedInUser, logOutUser, newUser } from "../controllers/user.js";
import { validateData } from "../middlewares/validationMiddlewate.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../schema/userSchema.js";

const app = express.Router();

app.get("/logout", logOutUser);
app.post("/new", validateData(userRegistrationSchema), newUser);
app.post("/login", validateData(userLoginSchema), loggedInUser);

export default app;
