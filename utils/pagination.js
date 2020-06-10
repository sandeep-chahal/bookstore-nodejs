module.exports = async (req, query) => {
	const currentPage = req.query.page || 1;
	const limit = req.query.limit || 10;
	const totalDocs = await query.estimatedDocumentCount();
	const totalPages = Math.ceil(totalDocs / limit);

	return {
		totalPages,
		currentPage,
		limit,
		skip: limit * (currentPage - 1),
	};
};
