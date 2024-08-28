import express from "express";
import pino from "pino-http";
import cors from "cors";

import { env } from "./utilits/env.js";
import { getAllContacts, getContactById } from "./services/contacts.js";

const PORT = Number(env("PORT", "3000"));

export const setupServer = () => {
	const app = express();

	app.use(express.json());
	app.use(cors());

	app.use(
		pino({
			transport: {
				target: "pino-pretty",
			},
		})
	);

	app.get("/contacts", async (req, res) => {
		const contacts = await getAllContacts();
		res.status(200).json({
			message: "Successfully found contacts!",
			data: contacts,
		});
	});

	app.use("*", (req, res, next) => {
		res.status(404).json({
			message: "Not found",
		});
	});

	app.listen(PORT, () => {
		console.log(`Server isrunning on port ${PORT}`);
	});
};
