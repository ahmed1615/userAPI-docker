const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const {
  generateUniqueEmail,
  clearAllUsers,
  getUsers,
  getUserByEmail,
  createUser,
  postWithout,
  postWithInvalidAge,
  updateUser,
  putWithout,
  deleteUserByEmail,
} = require("../../TestData/apiClient.js");


function storeResponse(world, result) {
  world.response = result.response;
  world.responseBody = result.responseBody;
}

function trackEmail(world, email, tag) {
  world.lastCreatedEmail = email;
  world.createdEmails.push(email);
  if (tag === "iso-dev") world.isolationEmails.dev = email;
  if (tag === "iso-prod") world.isolationEmails.prod = email;
}

Given("I clear all users in {string}", async function (env) {
  await clearAllUsers(env);
});

Given(
  "I create a user in {string} with name {string}, age {int}, and email tag {string}",
  async function (env, name, age, tag) {
    const email = `${tag}-${generateUniqueEmail()}`;
    const result = await createUser(env, name, age, { email });
    trackEmail(this, result.email, tag);
    storeResponse(this, result);
  }
);

When(
  "I create a user in {string} with name {string} and age {int}",
  async function (env, name, age) {
    const result = await createUser(env, name, age);
    trackEmail(this, result.email);
    storeResponse(this, result);
  }
);

When(
  "I create a duplicate user in {string} with name {string} and age {int}",
  async function (env, name, age) {
    const result = await createUser(env, name, age, { email: this.lastCreatedEmail });
    storeResponse(this, result);
  }
);

When(
  "I create a user in {string} without {string}",
  async function (env, field) {
    storeResponse(this, await postWithout(env, field));
  }
);

When(
  "I create a user in {string} with invalid age {string}",
  async function (env, ageStr) {
    storeResponse(this, await postWithInvalidAge(env, ageStr));
  }
);

When("I get all users in {string}", async function (env) {
  storeResponse(this, await getUsers(env));
});

When("I get the created user in {string}", async function (env) {
  storeResponse(this, await getUserByEmail(env, this.lastCreatedEmail));
});

When("I get a nonexistent user in {string}", async function (env) {
  storeResponse(this, await getUserByEmail(env, "nonexistent-user-12345"));
});

When(
  "I update the user in {string} with name {string} and age {int}",
  async function (env, name, age) {
    const data = { name, email: this.lastCreatedEmail, age };
    storeResponse(this, await updateUser(env, this.lastCreatedEmail, data));
  }
);

When(
  "I update a nonexistent user in {string} with name {string} and age {int}",
  async function (env, name, age) {
    const email = `ghost-${generateUniqueEmail()}`;
    storeResponse(this, await updateUser(env, email, { name, email, age }));
  }
);

When(
  "I update the user in {string} without {string}",
  async function (env, field) {
    storeResponse(this, await putWithout(env, this.lastCreatedEmail, field));
  }
);

When(
  "I update the user in {string} with out-of-range age {int}",
  async function (env, age) {
    const data = { name: "Updated", email: this.lastCreatedEmail, age };
    storeResponse(this, await updateUser(env, this.lastCreatedEmail, data));
  }
);

When(
  "I delete the created user in {string} with auth",
  async function (env) {
    storeResponse(this, await deleteUserByEmail(env, this.lastCreatedEmail, { withAuth: true }));
  }
);

When(
  "I delete the created user in {string} without auth",
  async function (env) {
    storeResponse(this, await deleteUserByEmail(env, this.lastCreatedEmail, {}));
  }
);

When(
  "I delete the created user in {string} with invalid token",
  async function (env) {
    storeResponse(this, await deleteUserByEmail(env, this.lastCreatedEmail, { invalidToken: true }));
  }
);

When(
  "I delete a nonexistent user in {string} with auth",
  async function (env) {
    storeResponse(this, await deleteUserByEmail(env, `del-ghost-${generateUniqueEmail()}`, { withAuth: true }));
  }
);

When(
  "I delete the created user again in {string} with auth",
  async function (env) {
    storeResponse(this, await deleteUserByEmail(env, this.lastCreatedEmail, { withAuth: true }));
  }
);

Then("the response status should be {int}", function (expectedStatus) {
  const actual = this.response.status;
  if (actual !== expectedStatus) {
    throw new Error(
      `Expected status: ${expectedStatus}\nReceived status: ${actual}`
    );
  }
});



Then("the response body should be an empty array", function () {
  assert.ok(Array.isArray(this.responseBody), `Expected an array, got: ${typeof this.responseBody}`);
  assert.strictEqual(this.responseBody.length, 0, `Expected empty array, got ${this.responseBody.length} items`);
});

Then("the response body should be an array", function () {
  assert.ok(Array.isArray(this.responseBody), `Expected an array, got: ${typeof this.responseBody}`);
});

Then("the response body should contain the created emails", function () {
  const emails = Array.isArray(this.responseBody)
    ? this.responseBody.map((u) => u.email)
    : [];
  for (const created of this.createdEmails) {
    assert.ok(emails.includes(created), `Expected email list to contain "${created}"\nFound: [${emails.join(", ")}]`);
  }
});

Then("the response body should not contain the created email", function () {
  const emails = Array.isArray(this.responseBody)
    ? this.responseBody.map((u) => u.email)
    : [];
  assert.ok(!emails.includes(this.lastCreatedEmail), `Expected email list NOT to contain "${this.lastCreatedEmail}"`);
});

Then(
  "the response body should contain the {string} user email",
  function (envKey) {
    const email = this.isolationEmails[envKey];
    const emails = Array.isArray(this.responseBody)
      ? this.responseBody.map((u) => u.email)
      : [];
    assert.ok(emails.includes(email), `Expected email list to contain "${email}"\nFound: [${emails.join(", ")}]`);
  }
);

Then(
  "the response body should not contain the {string} user email",
  function (envKey) {
    const email = this.isolationEmails[envKey];
    const emails = Array.isArray(this.responseBody)
      ? this.responseBody.map((u) => u.email)
      : [];
    assert.ok(!emails.includes(email), `Expected email list NOT to contain "${email}"`);
  }
);

Then("the response body should have name {string}", function (expectedName) {
  const data = Array.isArray(this.responseBody)
    ? this.responseBody[0]
    : this.responseBody;
  assert.strictEqual(data.name, expectedName, `Expected name: "${expectedName}"\nReceived name: "${data.name}"`);
});

Then("the response body should have age {int}", function (expectedAge) {
  const data = Array.isArray(this.responseBody)
    ? this.responseBody[0]
    : this.responseBody;
  assert.strictEqual(data.age, expectedAge, `Expected age: ${expectedAge}\nReceived age: ${data.age}`);
});

Then("each user should have {string} as a string", function (field) {
  const items = Array.isArray(this.responseBody)
    ? this.responseBody
    : [this.responseBody];
  for (const item of items) {
    assert.ok(field in item, `Expected property "${field}" to exist`);
    assert.strictEqual(typeof item[field], "string", `Expected "${field}" to be a string, got: ${typeof item[field]}`);
  }
});

Then("each user should have {string} as a number", function (field) {
  const items = Array.isArray(this.responseBody)
    ? this.responseBody
    : [this.responseBody];
  for (const item of items) {
    assert.ok(field in item, `Expected property "${field}" to exist`);
    assert.strictEqual(typeof item[field], "number", `Expected "${field}" to be a number, got: ${typeof item[field]}`);
  }
});
