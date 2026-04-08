const {
  setWorldConstructor,
  World,
  After,
} = require("@cucumber/cucumber");
const { deleteUserByEmail } = require("../../TestData/apiClient.js");

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.response = null;
    this.responseBody = null;
    this.createdEmails = [];
    this.isolationEmails = {};
    this.lastCreatedEmail = null;
  }
}

setWorldConstructor(CustomWorld);

After(async function () {
  for (const email of this.createdEmails) {
    try {
      await deleteUserByEmail("dev", email, { withAuth: true });
      await deleteUserByEmail("prod", email, { withAuth: true });
    } catch {
      console.log("No users found to delete yet");
    }
  }
});
