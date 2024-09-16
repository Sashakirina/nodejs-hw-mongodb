import { SORT_ORDER } from "../constans/index.js";

const parseSortParams = ({ sortBy, sortOrder }) => {
	const parsedSortBy = sortBy === "name" ? sortBy : "name";
	const parsedSortorder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)
		? sortOrder
		: SORT_ORDER.ASC;

	return {
		sortBy: parsedSortBy,
		sortOrder: parsedSortorder,
	};
};

export default parseSortParams;
