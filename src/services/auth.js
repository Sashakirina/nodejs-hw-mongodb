import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import handlebars from "handlebars";

import { UserCollection } from "../db/models/User.js";
import { SessionCollection } from "../db/models/Session.js";

import { FIFTEEN_MIN, ONE_DAY } from "../constans/auth.js";
import { env } from "../utilits/env.js";
import { sendEmail } from "../utilits/sendMail.js";
import { SMTP, TEMPLATES_DIR } from "../constans/index.js";
import { createJwtToken, verifyToken } from "../utilits/jwt.js";

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

export const requestResetToken = async (email) => {
	const user = await UserCollection.findOne({ email });
	if (!user) {
		throw createHttpError(404, "User not found");
	}

	const resetToken = createJwtToken({
		sub: user._id,
		email,
	});

	const resetPasswordTemplatePath = path.join(
		TEMPLATES_DIR,
		"reset-password-email.html"
	);

	const templateSource = (
		await fs.readFile(resetPasswordTemplatePath)
	).toString();

	const template = handlebars.compile(templateSource);

	const html = template({
		name: user.name,
		appDomain: env("APP_DOMAIN"),
		resetToken,
	});

	try {
		await sendEmail({
			from: env(SMTP.SMTP_FROM),
			to: email,
			subject: "Reset your password",
			html,
		});
	} catch (err) {
		throw createHttpError(
			500,
			err.message,
			"Failed to send the email, please try again later."
		);
	}
};

export const resetPassword = async (payload) => {
	const { data, error } = verifyToken(payload.token);
	if (error) {
		throw createHttpError(401, "Token invalid");
	}

	const user = await UserCollection.findOne({
		email: data.email,
		_id: data.sub,
	});
	if (!user) {
		throw createHttpError(404, "User not found");
	}

	const hashedPassword = await bcrypt.hash(payload.password, 10);

	await UserCollection.updateOne(
		{ _is: user._id },
		{ password: hashedPassword }
	);
};
