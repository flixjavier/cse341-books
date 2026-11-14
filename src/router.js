import express from "express";
import { getBooksHandler, getBookByIdHandler } from "./controllers/books.js";
import {
	getAuthorsHandler,
	getAuthorByIdHandler,
	createAuthorHandler,
	updateAuthorHandler,
	deleteAuthorHandler,
} from "./controllers/authors.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *    summary: Get all books
 *    tags:
 *     - Books
 *    responses:
 *      200:
 *        description: Book returned successfully
 *      500:
 *        description: Internal server error
 */

router.get("/books", getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

router.get("/books/:id", getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *    summary: Get all authors
 *    tags:
 *     - Authors
 *    responses:
 *      200:
 *        description: Array of authors returned successfully
 *      500:
 *        description: Internal server error
 *   post:
 *     summary: Create a new author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: a4
 *             name: John Doe
 *             birthYear: 1985
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The custom author id, such as a1
 *               name:
 *                 type: string
 *                 description: The author's name
 *               birthYear:
 *                 type: integer
 *                 description: The author's birth year
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Bad request (Invalid input or duplicate author ID)
 *       500:
 *         description: Internal server error
 */

router.get("/authors", getAuthorsHandler);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get one author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author id, such as a1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author returned successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update an existing author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author id, such as a4
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, birthYear]
 *             properties:
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             name: John Doe
 *             birthYear: 1984
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Invalid author data
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an existing author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author id, such as a4
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted successfully. No response body.
 *       404:
 *         description: Author not found
 *       409:
 *         description: Author is referenced by one or more books
 *       500:
 *         description: Internal server error
 */

router.get("/authors/:id", getAuthorByIdHandler);

router.post("/authors", createAuthorHandler);

router.put("/authors/:id", updateAuthorHandler);

router.delete("/authors/:id", deleteAuthorHandler);

export default router;
