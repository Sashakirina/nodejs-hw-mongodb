import { Router } from "express";
import { registerUserValidation } from "../validation/users.js";
import { validateBody } from "../utilits/validateBody.js";
import * as authControllers from "../controllers/auth.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
	"/register",
	validateBody(registerUserValidation),
	ctrlWrapper(authControllers.registerController)
);

export default authRouter;
