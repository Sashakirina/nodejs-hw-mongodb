import createHttpError from "http-errors";
import { UserCollection } from "../db/models/User.js";
import { SessionCollection } from "../db/models/Session.js";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { FIFTEEN_MIN, ONE_DAY } from "../constans/auth.js";

const createSession = () => {
	const accessToken = randomBytes(30).toString("base64");
	const refreshToken = randomBytes(30).toString("base64");
	const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MIN);
	const refreshTikenValidUntil = new Date(Date.now() + ONE_DAY);
	return {
		accessToken,
		refreshToken,
		accessTokenValidUntil,
		refreshTikenValidUntil,
	};
};

export const register = async (payload) => {
	const user = await UserCollection.findOne({ email: payload.email });

	if (user) {
		throw createHttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(payload.password, 10);

	const data = await UserCollection.create({
		...payload,
		password: hashPassword,
	});

	return data;
};

export const login = async (payload) => {
	const { email, password } = payload;
	const user = await UserCollection.findOne({ email });
	if (!user) {
		throw createHttpError(401, "Email  invalid");
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw createHttpError(401, "password invalid");
	}

	await SessionCollection.deleteOne({ userId: user._id });

	const newSession = createSession();

	return await SessionCollection.create({ ...newSession, userId: user._id });
};

export const refreshUserSession = async ({ refreshToken, sessionId }) => {
	const oldSession = await SessionCollection.findOne({
		_id: sessionId,
		refreshToken,
	});
	if (!oldSession) {
		throw createHttpError(401, "Session not found");
	}

	const isExpired = new Date() > oldSession.refreshToken;
	if (isExpired) {
		throw createHttpError(401, "Refreshtoken expired");
	}

	await SessionCollection.deleteOne({ _id: sessionId });

	const newSession = createSession();

	return await SessionCollection.create({
		...newSession,
		userId: oldSession._id,
	});
};

export const logout = async (sessionId) => {
	await SessionCollection.deleteOne({ _id: sessionId });
};
