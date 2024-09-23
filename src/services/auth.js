import createHttpError from "http-errors";
import { UserCollection } from "../db/models/User.js";
import bcrypt from "bcrypt";

export const register = async (payload) => {
	const user = await UserCollection.findOne({ email: payload.email });

	if (user) {
		throw createHttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(payload.email, 10);

	const data = await UserCollection.create({
		...payload,
		password: hashPassword,
	});

	return data;
};
