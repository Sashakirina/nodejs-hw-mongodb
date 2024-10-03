import * as authServices from "../services/auth.js";

const setupSession = (res, session) => {
	res.cookie("refreshToken", session.refreshToken, {
		httpOnly: true,
		expire: new Date(Date.now() + session.refreshTikenValidUntil),
	});

	res.cookie("sessionId", session._id, {
		httpOnly: true,
		expire: new Date(Date.now() + session.refreshTikenValidUntil),
	});
};

export const registerController = async (req, res) => {
	const data = await authServices.register(req.body);

	res.status(201).json({
		status: 201,
		message: "Successfully registered a user!",
		data,
	});
};

export const loginController = async (req, res) => {
	const session = await authServices.login(req.body);

	setupSession(res, session);

	res.json({
		status: 200,
		message: "Successfully logged in an user!",
		data: { accessToken: session.accessToken },
	});
};

export const refreshController = async (req, res) => {
	const session = await authServices.refreshUserSession({
		sessionId: req.cookies.sessionId,
		refreshToken: req.cookies.refreshToken,
	});

	setupSession(res, session);

	res.json({
		status: 200,
		message: "Successfully refreshed a session!",
		data: {
			accessToken: session.accessToken,
		},
	});
};

export const logoutController = async (req, res) => {
	if (req.cookies.sessionId) {
		await authServices.logout({ _id: req.cookies.sessionId });
	}

	res.clearCookie("sessionId");
	res.clearCookie("refreshToken");

	res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
	const { email } = req.body;
	await authServices.requestResetToken(email);

	res.json({
		status: 200,
		message: "Reset password email has been successfully sent.",
		data: {},
	});
};

export const resetPasswordController = async (req, res) => {
	await authServices.resetPassword(req.body, {
		sessionId: req.cookies.sessionId,
	});

	res.json({
		status: 200,
		message: "Password has been successfully reset.",
		data: {},
	});
};
