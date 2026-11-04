# as2026-ecommerce-api

E-commerce REST API built with Express for a simple checkout flow. It exposes four core endpoints — **register**, **login**, **cart**, and **checkout** — and stores all data in memory (no external database).

## How to install

```bash
npm install
```

Requires Node.js 18+.

## How to run

```bash
npm start
```

The server listens on **http://localhost:3000** by default. Override with `PORT`:

```bash
PORT=4000 npm start
```

For auto-reload during development:

```bash
npm run dev
```

## Test data

### Users

| ID     | Name          | Email             | Password  |
|--------|---------------|-------------------|-----------|
| user-1 | Alice Johnson | alice@example.com | alice123  |
| user-2 | Bob Smith     | bob@example.com   | bob123    |
| user-3 | Carol Davis   | carol@example.com | carol123  |

### Products

| ID     | Name                 | Price |
|--------|----------------------|-------|
| prod-1 | Wireless Headphones  | 100   |
| prod-2 | USB-C Hub            | 50    |
| prod-3 | Mechanical Keyboard  | 120   |

### Quick manual flow

```bash
# 1. Login
curl -s -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"alice123"}'

# 2. Add to cart (replace TOKEN)
curl -s -X POST http://localhost:3000/cart \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{"productId":"prod-1","quantity":1}'

# 3. Checkout with cash (10% discount)
curl -s -X POST http://localhost:3000/checkout \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{"paymentMethod":"cash"}'
```

## Business rules

1. **Authentication** — `/cart` and `/checkout` require a Bearer token from `/login`.
2. **Cash discount** — Paying with `cash` applies a **10%** discount on the cart subtotal.
3. **Credit card** — Paying with `credit_card` applies **no** discount.
4. **Empty cart** — Checkout fails if the cart has no items.
5. **In-memory storage** — Users, carts, sessions, and orders live in process memory and reset when the server restarts.

## Important URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000/ | API info |
| http://localhost:3000/api-docs | Swagger UI (rendered OpenAPI spec) |
| http://localhost:3000/swagger.yaml | Raw OpenAPI YAML specification |
| http://localhost:3000/register | `POST` — create a user |
| http://localhost:3000/login | `POST` — authenticate and get a token |
| http://localhost:3000/cart | `GET` / `POST` — view or add cart items |
| http://localhost:3000/checkout | `POST` — place an order |
