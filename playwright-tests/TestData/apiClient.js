const { baseUrl, authToken, usersPath, userPath } = require("./data.js");
const { generateUniqueEmail } = require("./generator.js");
const jsonHeaders = { "Content-Type": "application/json" };

async function getUsers(env) {
  const res = await fetch(`${baseUrl}${usersPath(env)}`);
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function getUserByEmail(env, email) {
  const res = await fetch(`${baseUrl}${userPath(env, email)}`);
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function createUser(env, name, age, opts = {}) {
  const email = opts.email || generateUniqueEmail();

  const res = await fetch(`${baseUrl}${usersPath(env)}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ name, email, age }),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body, email };
}

async function postWithout(env, field) {
  const data = { name: "Test", email: generateUniqueEmail(), age: 25 };
  delete data[field];

  const res = await fetch(`${baseUrl}${usersPath(env)}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function postWithEmpty(env, field) {
  const data = { name: "Test", email: generateUniqueEmail(), age: 25 };
  data[field] = "";

  const res = await fetch(`${baseUrl}${usersPath(env)}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function postWithInvalidAge(env, ageStr) {
  const data = { name: "Test", email: generateUniqueEmail(), age: ageStr };

  const res = await fetch(`${baseUrl}${usersPath(env)}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function postEmptyBody(env) {
  const res = await fetch(`${baseUrl}${usersPath(env)}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({}),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function postRawBody(env, rawBody) {
  const res = await fetch(`${baseUrl}${usersPath(env)}`, {
    method: "POST",
    headers: jsonHeaders,
    body: rawBody,
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function updateUser(env, email, data) {
  const res = await fetch(`${baseUrl}${userPath(env, email)}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function putWithout(env, email, field) {
  const data = { name: "Updated", email, age: 25 };
  delete data[field];

  const res = await fetch(`${baseUrl}${userPath(env, email)}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function deleteUserByEmail(env, email, opts = {}) {
  const headers = opts.withAuth
    ? { Authorization: `Bearer ${authToken}` }
    : opts.invalidToken
      ? { Authorization: "bad token" }
      : undefined;

  const res = await fetch(`${baseUrl}${userPath(env, email)}`, {
    method: "DELETE",
    headers,
  });
  const body = await res.json().catch(() => null);
  return { response: res, responseBody: body };
}

async function clearAllUsers(env) {
  const res = await fetch(`${baseUrl}${usersPath(env)}`);
  const body = await res.json().catch(() => null);

  if (res.status === 200 && Array.isArray(body)) {
    for (const user of body) {
      await fetch(`${baseUrl}${userPath(env, user.email)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  }
}

module.exports = {
  generateUniqueEmail,
  clearAllUsers,
  getUsers,
  getUserByEmail,
  createUser,
  postWithout,
  postWithEmpty,
  postWithInvalidAge,
  postEmptyBody,
  postRawBody,
  updateUser,
  putWithout,
  deleteUserByEmail,
};
