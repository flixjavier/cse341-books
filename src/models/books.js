import { getDb } from "../db/connect.js";
import { getAuthorById } from "./authors.js";

const bookProjection = {
	_id: 0,
	id: 1,
	authorId: 1,
	title: 1,
	publicationDate: 1,
};

const getAllBooks = async () => {
	const collection = getDb().collection("books");

	return await collection
		.find({}, { projection: bookProjection })
		.sort({ id: 1 })
		.toArray();
};

const getBookById = async (id) => {
	const collection = getDb().collection("books");
	return await collection.findOne({ id }, { projection: bookProjection });
};

const authorExists = async (authorId) => {return Boolean(await getAuthorById(authorId))};

const createBook = async (book) => {
	const collection = getDb().collection("books");
	return await collection.insertOne(book);
};

const updateBook = async (id, fields) => {
	const collection = getDb().collection("books");
	return await collection.updateOne({ id }, { $set: fields });
};

const deleteBook = async (id) => {
	const collection = getDb().collection("books");
	return await collection.deleteOne({ id });
};

export { getAllBooks, getBookById, authorExists, createBook, updateBook, deleteBook };
