const parseInteger = (value, defaultValue) => {
	if (typeof value !== "string") return defaultValue;

	const parsedNumber = parseInt(value);
	if (Number.isNaN(parsedNumber)) return defaultValue;

	return parsedNumber;
};

const parsePaginationParams = ({ perPage, page }) => {
	const parsedPerPage = parseInteger(perPage);
	const parsedPage = parseInteger(page);

	return {
		page: parsedPage,
		perPage: parsedPerPage,
	};
};

export default parsePaginationParams;
