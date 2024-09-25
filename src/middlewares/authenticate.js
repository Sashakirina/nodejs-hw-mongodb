import createHttpError from "http-errors";
import { SessionCollection } from "../db/models/Session.js";
import { UserCollection } from "../db/models/User.js";

export const authenticate = async (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return next(createHttpError(401, "Authorization token not found"));
	}

	const [bearer, token] = authHeader.split(" ");

	if (bearer !== "Bearer") {
		return next(
			createHttpError(401, "Authorization token must have Bearer type")
		);
	}

	const session = await SessionCollection.findOne({ accessToken: token });
	if (!session) {
		return next(createHttpError(401, "Session not found"));
	}

	if (new Date() > session.accessTokenValidUntil) {
		return next(createHttpError(401, "Access token expired"));
	}

	const user = await UserCollection.findOne({ _id: session.userId });

	if (!user) {
		return next(createHttpError(401, "User not found"));
	}

	req.user = user;

	next();
};
