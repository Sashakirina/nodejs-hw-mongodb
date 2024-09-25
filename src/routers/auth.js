import { Router } from "express";

import {
	loginUserValidation,
	registerUserValidation,
} from "../validation/users.js";
import { validateBody } from "../utilits/validateBody.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";

import * as authControllers from "../controllers/auth.js";

const authRouter = Router();

authRouter.post(
	"/register",
	validateBody(registerUserValidation),
	ctrlWrapper(authControllers.registerController)
);

authRouter.post(
	"/login",
	validateBody(loginUserValidation),
	ctrlWrapper(authControllers.loginController)
);

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

export default authRouter;
