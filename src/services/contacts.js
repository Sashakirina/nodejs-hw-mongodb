import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
	const contacts = await ContactsCollection.find();
	return contacts;
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
