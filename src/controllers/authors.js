import {
	getAllAuthors as getAllAuthorsFromDb,
	getAuthorById,
	createAuthor,
	updateAuthor,
	authorHasBooks,
	deleteAuthor,
} from "../models/authors.js";

const getAuthorsHandler = async (req, res) => {
	try {
		const authors = await getAllAuthorsFromDb();
		return res.status(200).json(authors);
	} catch (error) {
		console.error("GET /authors failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const getAuthorByIdHandler = async (req, res) => {
	const requestedId = req.params.id;
	try {
		const author = await getAuthorById(requestedId);
		if (!author) {
			return res.status(404).json({ message: "Author not found" });
		}

		return res.status(200).json(author);
	} catch (error) {
		console.error(`GET /authors/:id failed:`, error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const createAuthorHandler = async (req, res) => {
	const newAuthor = req.body;
	try {
		if (!Number.isInteger(newAuthor?.birthYear)) {
			return res.status(400).json({ message: "birthYear must be an integer" });
		}
		if (typeof newAuthor?.name !== "string" || newAuthor.name.trim() === "") {
			return res
				.status(400)
				.json({ message: "name must be a non-empty string" });
		}
		if (typeof newAuthor?.id !== "string" || newAuthor.id.trim() === "") {
			return res.status(400).json({ message: "id must be a non-empty string" });
		}

		const existingAuthor = await getAuthorById(newAuthor.id);
		if (existingAuthor) {
			return res.status(400).json({ message: "Author ID already exists" });
		}
		const { id, name, birthYear } = newAuthor;
		await createAuthor({ id, name, birthYear });
		return res.status(201).json({ id, name, birthYear });
	} catch (error) {
		console.error("POST /authors failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const updateAuthorHandler = async (req, res) => {
	const { id } = req.params;
	const { name, birthYear } = req.body ?? {};

	if (typeof name !== "string" || name.trim() === "") {
		return res.status(400).json({ message: "name must be a non-empty string" });
	}
	if (!Number.isInteger(birthYear)) {
		return res.status(400).json({ message: "birthYear must be an integer" });
	}

	try {
		const result = await updateAuthor(id, { name, birthYear });

		if (result.matchedCount === 0) {
			return res.status(404).json({ message: "Author not found" });
		}

		return res.status(200).json({ id, name, birthYear });
	} catch (error) {
		console.error("PUT /authors/:id failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const deleteAuthorHandler = async (req, res) => {
	const { id } = req.params;
	try {
		const author = await getAuthorById(id);
		if (!author) {
			return res.status(404).json({ message: "Author not found" });
		}

		if (await authorHasBooks(id)) {
			return res.status(409).json({
				message: "Author is referenced by one or more books",
			});
		}

		const result = await deleteAuthor(id);
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Author not found" });
		}

		return res.status(204).end();
	} catch (error) {
		console.error("DELETE /authors/:id failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export {
	getAuthorsHandler,
	getAuthorByIdHandler,
	createAuthorHandler,
	updateAuthorHandler,
	deleteAuthorHandler,
};
