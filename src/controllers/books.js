import {
	getAllBooks,
	getBookById,
	authorExists,
	createBook,
	updateBook,
	deleteBook,
} from "../models/books.js";

const findInvalidField = (book, requiredFields) =>
	{return requiredFields.find((field) =>
		{return typeof book[field] !== "string" || book[field].trim() === ""},
	)};

const getBooksHandler = async (req, res) => {
	try {
		const books = await getAllBooks();
		return res.status(200).json(books);
	} catch (error) {
		console.error("GET /books failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const getBookByIdHandler = async (req, res) => {
	const requestedId = req.params.id;
	try {
		const book = await getBookById(requestedId);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}

		return res.status(200).json(book);
	} catch (error) {
		console.error(`GET /books/:id failed:`, error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const createBookHandler = async (req, res) => {
	const book = req.body ?? {};
	const invalidField = findInvalidField(book, ["id", "authorId", "title", "publicationDate"]);
	if (invalidField) {
		return res.status(400).json({ message: `${invalidField} must be a non-empty string` });
	}

	const { id, authorId, title, publicationDate } = book;
	try {
		if (await getBookById(id)) {
			return res.status(400).json({ message: "Book ID already exists" });
		}
		if (!(await authorExists(authorId))) {
			return res.status(400).json({ message: "Author ID does not exist" });
		}

		await createBook({ id, authorId, title, publicationDate });
		return res.status(201).json({ id, authorId, title, publicationDate });
	} catch (error) {
		if (error.code === 11000 && error.keyPattern?.id) {
			return res.status(400).json({ message: "Book ID already exists" });
		}
		console.error("POST /books failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const updateBookHandler = async (req, res) => {
	const book = req.body ?? {};
	const invalidField = findInvalidField(book, ["authorId", "title", "publicationDate"]);
	if (invalidField) {
		return res.status(400).json({ message: `${invalidField} must be a non-empty string` });
	}

	const { id } = req.params;
	const { authorId, title, publicationDate } = book;
	try {
		if (!(await authorExists(authorId))) {
			return res.status(400).json({ message: "Author ID does not exist" });
		}

		const result = await updateBook(id, { authorId, title, publicationDate });
		if (result.matchedCount === 0) {
			return res.status(404).json({ message: "Book not found" });
		}

		return res.status(200).json({ id, authorId, title, publicationDate });
	} catch (error) {
		console.error("PUT /books/:id failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const deleteBookHandler = async (req, res) => {
	try {
		const result = await deleteBook(req.params.id);
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Book not found" });
		}

		return res.status(204).end();
	} catch (error) {
		console.error("DELETE /books/:id failed:", error.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export {
	getBooksHandler,
	getBookByIdHandler,
	createBookHandler,
	updateBookHandler,
	deleteBookHandler,
};
