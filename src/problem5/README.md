# Problem 5 — Users CRUD API

Express + TypeScript + Prisma + PostgreSQL

## Architecture

```
src/
├── config/          # Environment configuration
├── routes/          # HTTP route definitions
├── controllers/     # Request parsing, response formatting
├── services/        # Business logic
└── repositories/    # Data access (Prisma queries)
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose

## Setup

```bash
cd src/problem5

# Start PostgreSQL
docker compose up -d

# Install dependencies
npm install

# Push schema to database
npx prisma db push

# Start dev server
npm run dev
```

Server runs on `http://localhost:3000`.

## Configuration

Environment variables in `.env`:

| Variable       | Default                                                |
|----------------|--------------------------------------------------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/problem5`|
| `PORT`         | `3000`                                                 |

## API Endpoints

Base path: `/api/users`

| Method   | Endpoint           | Body                    | Description                          |
|----------|--------------------|-------------------------|--------------------------------------|
| `POST`   | `/api/users`       | `{ name, email }`       | Create a user                        |
| `GET`    | `/api/users`       | —                       | List users (`?name=&email=` filters) |
| `GET`    | `/api/users/:id`   | —                       | Get user by id                       |
| `PUT`    | `/api/users/:id`   | `{ name?, email? }`     | Update user (partial)                |
| `DELETE` | `/api/users/:id`   | —                       | Delete user                          |

## Examples

```bash
# Create
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# List with filter
curl http://localhost:3000/api/users?name=Alice

# Get by id
curl http://localhost:3000/api/users/1

# Update
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith"}'

# Delete
curl -X DELETE http://localhost:3000/api/users/1
```

## Testing

```bash
# Unit tests (no Docker required)
npm run test:unit

# Integration tests (requires Docker)
npm run test:integration

# All tests
npm test
```

- **Unit tests** — controller layer: input validation, error code mapping, response status codes (mocked service)
- **Integration tests** — full CRUD lifecycle against a real PostgreSQL via testcontainers

## Production Build

```bash
npm run build
npm start
```
