// import createHttpError from "http-errors";

export const notFoundHandler = (req, res, next) => {
	// if (!req.url) {
	//     throw createHttpError(404, "Rout not found");
	//     return;
	// }
	res.status(404).json({
		status: 404,
		message: "Not found",
	});
};
