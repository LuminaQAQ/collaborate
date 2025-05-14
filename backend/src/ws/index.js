const { exec } = require("child_process")

const HOST = "localhost";
const PORT = 5000;

module.exports = () => {
    exec(`HOST=${HOST} PORT=${PORT} npx y-websocket`);
}