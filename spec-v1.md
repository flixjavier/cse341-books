# Books API Spec — Version 1

## Purpose
Create a basic web service that returns book data.

## Data Model
Book fields:
- id: string
- author: string
- title: string
- publicationDate: string

## Endpoints
1. GET /books
- Returns all books.
- Response status: 200 on success.

2. GET /books/:id
- Returns one book with matching id.
- Response status: 200 on success.
- If no match: 404.

## Initial Assumptions
- Data is stored in a MongoDB collection named books.
- API returns JSON.