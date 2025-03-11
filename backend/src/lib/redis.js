const Redis = require("ioredis")

/**
 * @type {Redis.RedisCommander}
 */
const redis = new Redis({
    host: "127.0.0.1",
    port: 6379
});

module.exports = redis;