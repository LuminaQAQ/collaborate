const { readFileSync } = require("fs");
const env = readFileSync("./.env").toString().split("\n");

module.exports = () => {
  env.forEach((item) => {
    const [k, v] = item.split("=").map((item) => item.trim());
    process.env[k] = v;
  });
};
