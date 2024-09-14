import { contactTypesList } from "../../constans/contacts.js";

const parseType = (type) => {
	if (typeof type !== "string") return;

	if (contactTypesList.includes(type)) return type;
};

const parseBoolean = (value) => {
	if (typeof value !== "string") return;

	if (["true", "false"].includes(value)) return value;
};

const parseContactFilterParams = ({ type, isFavourite }) => {
	const parsedType = parseType(type);
	const parsedIsFavoirite = parseBoolean(isFavourite);

	return {
		typpe: parsedType,
		isFavourite: parsedIsFavoirite,
	};
};

export default parseContactFilterParams;
