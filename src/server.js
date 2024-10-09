import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import logger from './middlewares/logger.js';

import contactsRouter from "./routers/contatcs.js";
import authRouter from "./routers/auth.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { env } from "./utilits/env.js";
import { UPLOAD_DIR } from "./constans/index.js";

const PORT = Number(env("PORT", "3000"));

export const setupServer = () => {
	const app = express();

	app.use(express.json());

	// app.use(logger);
	app.use(cors());
	app.use(cookieParser());

	app.use("/uploads", express.static(UPLOAD_DIR));

	app.use("/contacts", contactsRouter);
	app.use("/auth", authRouter);

	app.use(errorHandler);

	app.use("*", notFoundHandler);

	app.listen(PORT, () => {
		console.log(`Server isrunning on port ${PORT}`);
	});
};
