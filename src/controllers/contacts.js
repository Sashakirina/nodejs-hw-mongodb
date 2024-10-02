import createHttpError from "http-errors";
import * as contactsServices from "../services/contacts.js";
import parsePaginationParams from "../utilits/parsePaginationParams.js";
import parseSortParams from "../utilits/parseSortParams.js";
import parseContactFilterParams from "../utilits/filter/parseContactFilterParams.js";
import { saveFileToUploadDir } from "../utilits/saveFileToUploadDir.js";
import { env } from "../utilits/env.js";
import { saveFileToCloudinary } from "../utilits/saveFileToCloudinary.js";

export const getContactsController = async (req, res) => {
	const { page, perPage } = parsePaginationParams(req.query);
	const { sortBy, sortOrder } = parseSortParams(req.query);
	const filter = parseContactFilterParams(req.query);

	const { _id: userId } = req.user;

	const data = await contactsServices.getContacts({
		page,
		perPage,
		sortBy,
		sortOrder,
		filter: { ...filter, userId },
	});

	res.status(200).json({
		status: 200,
		message: "Successfully found contacts!",
		data,
	});
};

export const getContactByIdController = async (req, res, next) => {
	const { contactId } = req.params;
	const contact = await contactsServices.getContactById(contactId);

	if (!contact) {
		throw createHttpError(404, `Contact with id ${contactId} not found`);
	}

	if (contact) {
		res.status(200).json({
			status: 200,
			message: `Successfully found contact with id${contactId}!`,
			data: contact,
		});
	}
};

export const createContactController = async (req, res) => {
	const { _id: userId } = req.user;
	const photo = req.file;

	let photoUrl;

	if (photo) {
		if (env("ENABLE_CLOUDINARY") === "true") {
			photoUrl = await saveFileToCloudinary(photo);
		} else {
			photoUrl = await saveFileToUploadDir(photo);
		}
	}

	const contact = await contactsServices.createContact({
		...req.body,
		userId,
		photo: photoUrl,
	});

	res.status(201).json({
		status: 201,
		message: "Successfully created a contact!",
		data: contact,
	});
};

export const patchContactController = async (req, res, next) => {
	const { contactId } = req.params;
	const photo = req.file;

	let photoUrl;

	if (photo) {
		if (env("ENABLE_CLOUDINARY") === "true") {
			photoUrl = await saveFileToCloudinary(photo);
		} else {
			photoUrl = await saveFileToUploadDir(photo);
		}
	}

	const result = await contactsServices.updateContact(
		{ _id: contactId },
		{ ...req.body, photo: photoUrl }
	);

	if (!result.data) {
		next(createHttpError(404, `Contact with id ${contactId} not found`));
	}

	res.status(200).json({
		status: 200,
		message: "Successfully patched a contact!",
		data: result.data,
	});
};

export const deleteContactController = async (req, res) => {
	const { contactId } = req.params;
	const data = await contactsServices.deleteContact(contactId);

	if (!data) {
		throw createHttpError(404, `Contact with id ${contactId} not found`);
	}
	res.status(204).send();
};
