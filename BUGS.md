## Bug 1: PUT does not persist data

> **Env:** dev, prod 

**Description :**
The API returns `200 OK` with the updated values, but a follow-up `GET` still returns the original data. Updates are silently lost.

**Reproduce:**
```bash
# 1. Create a user
curl -X POST localhost:3000/dev/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Initial", "email": "test@test.com", "age": 20}'

# 2. Update the user
curl -X PUT localhost:3000/dev/users/test@test.com \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated", "email": "test@test.com", "age": 35}'
# Returns 200 with {"name": "Updated", "age": 35} -- looks correct

# 3. Fetch the user again
curl localhost:3000/dev/users/test@test.com
# Returns {"name": "Initial", "age": 20} -- still the old data!
```

---

## Bug 2: GET nonexistent user returns 500 instead of 404

> **Env:** dev, prod

**Description :**
Looking up a user that doesn't exist returns `500 Internal Server Error` instead of `404 Not Found`.

**Reproduce:**
```bash
curl localhost:3000/dev/users/nonexistent@test.com
# Expected: 404 {"error": "User not found"}
# Actual:   500 {"error": "Internal server error"}
```
---

## Bug 3: Duplicate POST returns 500 instead of 409

>**Env:** dev, prod

**Description :**
Creating a user with an email that already exists returns `500 Internal Server Error` instead of `409 Conflict`.

**Reproduce:**
```bash
# 1. Create a user
curl -X POST localhost:3000/dev/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Original", "email": "dup@test.com", "age": 25}'

# 2. Try to create another with the same email
curl -X POST localhost:3000/dev/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Duplicate", "email": "dup@test.com", "age": 30}'
# Expected: 409 with duplicate error
# Actual:   500 {"error": "Internal server error"}
```
---

## Bug 4: DELETE always returns 401 in prod

> **Env:** prod only

**Description :**
Every `DELETE` request in prod returns `401 Unauthorized` — even with the correct authentication token. Users can never be deleted in production.

**Reproduce:**
```bash
# Create a user in prod
curl -X POST localhost:3000/prod/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@test.com", "age": 25}'

# Try to delete with valid token
curl -X DELETE localhost:3000/prod/users/test@test.com \
  -H "Authorization: Bearer mysecrettoken"
# Expected: 204 No Content
# Actual:   401 {"error": "Authentication required"}
```

---

## Bug 5: DELETE skips authentication in dev

> **Env:** dev 

**Description :**
The dev environment allows `DELETE` requests without any authentication. Requests with no `Authorization` header succeed and return `204`.

**Reproduce:**
```bash
# Create a user
curl -X POST localhost:3000/dev/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@test.com", "age": 25}'

# Delete WITHOUT auth header
curl -X DELETE localhost:3000/dev/users/test@test.com
# Expected: 401 {"error": "Authentication required"}
# Actual:   204 -- user deleted, no auth needed
```
