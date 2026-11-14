import { getDb } from "../db/connect.js";

const getAllAuthors = async () => {
	const db = getDb();

	const collection = db.collection("authors");

	const authors = await collection
		.find(
			{},
			{
				projection: {
					_id: 0,
					id: 1,
					name: 1,
					birthYear: 1,
				},
			},
		)
		.sort({ id: 1 })
		.toArray();

	return authors;
};

const getAuthorById = async (authorId) => {
	const db = getDb();
	const collection = db.collection("authors");
	const author = await collection.findOne(
		{ id: authorId },
		{ projection: { _id: 0, id: 1, name: 1, birthYear: 1 } },
	);

	return author;
};

const createAuthor = async (author) => {
	const db = getDb();
	const collection = db.collection("authors");
	const result = await collection.insertOne(author);
	return result;
};

const updateAuthor = async (authorId, author) => {
	const db = getDb();
	const collection = db.collection("authors");

	return await collection.updateOne(
		{ id: authorId },
		{ $set: { name: author.name, birthYear: author.birthYear } },
	);
};

const authorHasBooks = async (authorId) => {
  const db = getDb();
  const collection = db.collection("books");
  const book = await collection.findOne({ authorId });
  return book !== null;
};

const deleteAuthor = async (authorId) => {
  const db = getDb();
  const collection = db.collection("authors");

  return await collection.deleteOne({ id: authorId });
};

export {
	getAllAuthors,
	getAuthorById,
	createAuthor,
	updateAuthor,
	authorHasBooks,
	deleteAuthor,
};
