import { model, Schema } from "mongoose";

const sessionSchema = new Schema(
	{
		userId: { type: String, required: true },
		accessToken: { type: String, required: true },
		refreshToken: { type: String, required: true },
		accessTokenValidUntil: { type: Date, required: true },
		refreshTikenValidUntil: { type: Date, required: true },
	},
	{ timestamps: false, versionKey: false }
);

export const SessionCollection = model("session", sessionSchema);
