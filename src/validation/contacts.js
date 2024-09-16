import Joi from "joi";
import { contactTypesList } from "../constans/contacts.js";

export const contactAddSchema = Joi.object({
	name: Joi.string().min(3).max(20).required(),
	phoneNumber: Joi.string().min(3).max(20).required(),
	email: Joi.string().min(3).max(20).email(),
	isFavourite: Joi.boolean().required(),
	contactType: Joi.string()
		.valid(...contactTypesList)
		.required(),
});

export const contactUpdateSchema = Joi.object({
	name: Joi.string().min(3).max(20),
	phoneNumber: Joi.string().min(3).max(20),
	email: Joi.string().min(3).max(20).email(),
	isFavourite: Joi.boolean(),
	contactType: Joi.string().valid(...contactTypesList),
});
