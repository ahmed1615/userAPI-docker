require("dotenv").config();

const baseUrl = process.env.BASE_URL;
const authToken = process.env.AUTH_TOKEN;

const paths = {
  dev: "/dev/users",
  prod: "/prod/users",
};

function usersPath(env) {
  return paths[env];
}

function userPath(env, email) {
  return `${paths[env]}/${email}`;
}

module.exports = { baseUrl, authToken, paths, usersPath, userPath };
