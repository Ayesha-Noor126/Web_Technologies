# Express.js Basics — Phase 1

A hands-on Express.js project built for learning core backend concepts from scratch.

---

## What This Project Covers

### Server Setup
- Created an Express server with `express()`
- Configured port and basic `app.listen()`
- Set up EJS as the view engine

### Routing
- Separated routes into individual files (`home.js`, `about.js`, `contact.js`, `userRoutes.js`)
- Mounted routes using `app.use()` with path prefixes
- Used `express.Router()` to keep route files clean

### Middleware
- **Global middleware** — `logger.js` runs on every single request, logs method + URL + timestamp
- **Route-level middleware** — `auth.js` protects specific routes only
- Understood the `(req, res, next)` pattern and why `next()` is critical

### Response Types
| Method | Used for |
|---|---|
| `res.send()` | Plain text response |
| `res.json()` | API/JSON response |
| `res.status()` | Setting HTTP status codes |
| `res.render()` | Rendering EJS views |

### Request Object
| Property | What it reads |
|---|---|
| `req.body` | Data from POST request body |
| `req.params` | URL parameters like `/user/:id` |
| `req.query` | Query strings like `?name=Ayesha` |

### Status Codes Practiced
- `200` — success
- `401` — unauthorized
- `404` — not found

---

## Project Structure

```
EXPRESS-PRACTICE/
├── middleware/
│   ├── auth.js        ← protects routes (fake auth check)
│   └── logger.js      ← logs every incoming request
├── routes/
│   ├── about.js
│   ├── contact.js
│   ├── home.js
│   └── userRoutes.js  ← main API routes with CRUD practice
├── views/
│   ├── about.ejs
│   ├── contact.ejs
│   ├── home.ejs
│   └── index.ejs
├── package.json
└── server.js          ← entry point
```

---

## API Routes (userRoutes.js)

| Method | Route | Description |
|---|---|---|
| GET | `/api/hello` | Basic text response |
| GET | `/api/user` | Returns user JSON |
| GET | `/api/user/:id` | URL param example |
| GET | `/api/search?name=x` | Query string example |
| GET | `/api/profile` | Protected by auth middleware |
| GET | `/api/success` | 200 status example |
| GET | `/api/error` | 404 status example |
| POST | `/api/user` | Returns posted body |

---

## How to Run

```bash
# Install dependencies
npm install

# Start server
node server.js

# Server runs at
http://localhost:3000
```

---

## Key Concepts Learned

**Middleware flow:**
```
Request → logger.js → auth.js (if protected) → Route Handler → Response
```

**Every middleware must do one of two things:**
- Call `next()` to pass to the next step
- Send a response with `res.send()` / `res.json()`

If it does neither — the request hangs forever.

**Route mounting:**
```js
app.use('/api', auth, userRoutes);
// means: all /api/* routes first go through auth, then userRoutes handles them
```

---


## Tech Stack

- Node.js
- Express.js
- EJS (templating)
- Postman (API testing)