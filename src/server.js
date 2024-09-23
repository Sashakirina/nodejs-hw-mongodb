import express from "express";
// import pino from "pino-http";
import cors from "cors";

import { env } from "./utilits/env.js";
import contactsRouter from "./routers/contatcs.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import authRouter from "./routers/auth.js";

const PORT = Number(env("PORT", "3000"));

export const setupServer = () => {
	const app = express();

	app.use(express.json());
	app.use(cors());

	// app.use(
	// 	pino({
	// 		transport: {
	// 			target: "pino-pretty",
	// 		},
	// 	})
	// );

	app.use("/contacts", contactsRouter);
	app.use("/auth", authRouter);

	app.use(errorHandler);

	app.use("*", notFoundHandler);

	app.listen(PORT, () => {
		console.log(`Server isrunning on port ${PORT}`);
	});
};
