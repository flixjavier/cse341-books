# Books API Spec — Version 2

## Purpose
Build a read-only Books API using Express and MongoDB.
Clients can retrieve all books or retrieve one book by its custom id.

## Data Model
MongoDB database: cse341-books-db
MongoDB collection: books

Each book returned by the API contains these required fields:
- id: string, a unique custom identifier such as "b1".
- author: string.
- title: string.
- publicationDate: string in ISO 8601 date format
  (YYYY-MM-DD), for example "2021-08-17".

MongoDB's automatic _id field is not included in API responses.

## Endpoints

### 1. GET /books
Return all books as a JSON array containing only the required fields.

Input:
- No request body or query parameters are required.

Success:
- Status: 200 OK
- Return books ordered by custom id in ascending order.

Example response:
```json
[
  {
    "id": "b1",
    "author": "Maya Rivera",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  },
  {
    "id": "b2",
    "author": "Daniel Chen",
    "title": "Beyond the Horizon",
    "publicationDate": "2023-04-12"
  }
]
```

If the collection contains no books:
- Status: 200 OK
- Response body:
```json
[]
```

Unexpected server or database failure:
- Status: 500 Internal Server Error
- Response body:
```json
{
  "message": "Internal server error"
}
```

### 2. GET /books/:id
Return one book whose custom id matches the path parameter.

Input:
- Required path parameter: id.
- Example request: GET /books/b1.
- Match the custom id exactly, including letter case.
- No request body or query parameters are required.

Success:
- Status: 200 OK
- Return a single book object containing only the required fields.

Example response:
```json
{
  "id": "b1",
  "author": "Maya Rivera",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

If no book matches the id:
- Status: 404 Not Found
- Response body:
```json
{
  "message": "Book not found"
}
```

Unexpected server or database failure:
- Status: 500 Internal Server Error
- Response body:
```json
{
  "message": "Internal server error"
}
```

## Response Format
- All responses described above use JSON.
- Set the response Content-Type to application/json.
- GET /books returns an array on success.
- GET /books/:id returns one object on success.
- Error responses contain a message field.

## Error Handling and Security
- Do not return stack traces or internal database error details to clients.
- Log technical error details on the server without exposing credentials.
- Treat the id path parameter as a string value when querying MongoDB.
- Keep the MongoDB connection string in an environment variable.
- Do not commit credentials or the .env file to version control.

## Implementation Notes
- Use the books collection in cse341-books-db.
- Seed the collection with book documents needed for testing.
- Query individual books using the custom id field, not MongoDB's _id.
- Return only id, author, title, and publicationDate.
- Do not change stored book data through these endpoints.

## Verification Checklist
- GET /books returns 200 and an array of books.
- GET /books returns books ordered by id.
- GET /books returns 200 and [] when the collection is empty.
- GET /books/b1 returns 200 and the matching book when it exists.
- GET /books/unknown returns 404 and the specified message.
- Unexpected database failures return 500 and the specified message.
- Responses exclude MongoDB's _id and internal error details.
- Publication dates follow YYYY-MM-DD.

## Out of Scope for Week 1
- POST, PUT, and DELETE routes.
- Authentication and authorization.
- Pagination, filtering, and search.