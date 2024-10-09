import { Router } from "express";

import {
	loginUserValidation,
	registerUserValidation,
	requestResetEmailSchema,
	resetPasswordSchema,
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

authRouter.post(
	"/send-reset-email",
	validateBody(requestResetEmailSchema),
	ctrlWrapper(authControllers.requestResetEmailController)
);

authRouter.post(
	"/reset-pwd",
	validateBody(resetPasswordSchema),
	ctrlWrapper(authControllers.resetPasswordController)
);

export default authRouter;
