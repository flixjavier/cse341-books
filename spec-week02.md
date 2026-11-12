# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Store authors in a separate collection and support all author CRUD operations.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required, first and last name
- `birthYear`: integer, required, such as `1985`

Authors use custom string ids for route parameters.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects, or `[]` when there are no authors

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing Author.

Success:
- Status code: `204`
- Response body: none

Errors:

- `404` The server can not find the requested author.

- `409` Conflict: If any book references this author. The author and all their books are kept.

- `500` Internal Server Error: Unexpected server or database error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "John Doe",
      "birthYear": 1985
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "John Doe",
      "birthYear": 1985
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger at `/api-docs` must document all five author routes so they can be tested in a browser.

### Deployment Expectations
All author routes must work locally and on Render. The Swagger page must support testing them in both environments.

# Books API Week 02 Spec - Version 2

Version 2 uses the Version 1 fields, routes, request examples, and status codes, with the clarifications below.

## Feature 1: Book CRUD Operations and Author References

- Before deploying, create author records for the existing Week 01 books and replace each book's `author` name with the corresponding `authorId`. Keep the existing book IDs.
- For POST and PUT, return `400` when a required field has the wrong type or is blank. PUT uses the book ID in the URL and updates only `authorId`, `title`, and `publicationDate`. An unknown `authorId` returns `400` with `{"message":"Author ID does not exist"}`.
- GET, POST, and PUT return book objects with `id`, `authorId`, `title`, and `publicationDate`. GET /books returns `[]` when there are no books. DELETE returns an empty body on `204`.
- Return JSON errors with a `message` field, such as `{"message":"Book not found"}` for `404`. For `500`, return `{"message":"Internal server error"}` and keep database details in server logs.

## Feature 2: Author CRUD Operations

- For POST and PUT, return `400` for a blank required string or a field with the wrong type. For example, return `{"message":"birthYear must be an integer"}` when a client sends a string for `birthYear`. PUT uses the ID in the URL and updates only `name` and `birthYear`.
- GET, POST, and PUT return author objects with `id`, `name`, and `birthYear`. GET /authors returns `[]` when there are no authors. DELETE returns an empty body on `204`.
- When deleting an author, check for one book with the matching `authorId`. If a match exists, keep the author and books and return `409` with `{"message":"Author is referenced by one or more books"}`.
- Use the same JSON error format as the book routes. Return `{"message":"Author not found"}` for `404` and `{"message":"Internal server error"}` for `500`.

## Swagger Verification

Document and test all ten routes through `/api-docs` locally and on Render. Verify the request and response bodies, status codes, and the `409` response when deleting an author who still has a book.
