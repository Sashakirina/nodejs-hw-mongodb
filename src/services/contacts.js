import { SORT_ORDER } from "../constans/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
import calculatePaginationData from "../utilits/calculatePaginationData.js";

export const getContacts = async ({
	perPage = 10,
	page = 1,
	sortBy = "name",
	sortOrder = SORT_ORDER.ASC,
	filter = {},
}) => {
	const skip = (page - 1) * perPage;

	const contactQuery = ContactsCollection.find();

	if (filter.type) {
		contactQuery.where("contactType").equals(filter.type);
	}

	if (filter.isFavourite) {
		contactQuery.where("isFavourite").equals(filter.isFavourite);
	}

	if (filter.userId) {
		contactQuery.where("userId").equals(filter.userId);
	}

	const [count, data] = await Promise.all([
		ContactsCollection.find().merge(contactQuery).countDocuments(),
		contactQuery
			.skip(skip)
			.limit(perPage)
			.sort({ [sortBy]: sortOrder })
			.exec(),
	]);

	const paginationData = calculatePaginationData({ count, perPage, page });

	return {
		data,
		page,
		perPage,
		totalItems: count,
		...paginationData,
	};
};

export const getContactById = async (contactId) => {
	const contact = await ContactsCollection.findById(contactId);
	return contact;
};

export const createContact = async (payload) => {
	const contact = await ContactsCollection.create(payload);
	return contact;
};

export const updateContact = async (filter, data, options = {}) => {
	const rawResult = await ContactsCollection.findOneAndUpdate(filter, data, {
		new: true,
		includeResultMetadata: true,
		...options,
	});

	return { data: rawResult.value };
};

export const deleteContact = (filter) => {
	const result = ContactsCollection.findOneAndDelete(filter);
	return result;
};
