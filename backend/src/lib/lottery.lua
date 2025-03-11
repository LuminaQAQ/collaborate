local key = KEYS[1]
local limit_count = tonumber(ARGV[1])
local ex_time = tonumber(ARGV[2])
local count = tonumber(redis.call("get", key) or "0")

if count >= limit_count then
    return 0
else
    redis.call("incr", key)
    redis.call("expire", key, ex_time)
    return 1
end
