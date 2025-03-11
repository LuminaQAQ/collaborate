const generateRedisSMSCodeKey = (email) => {
    return `sms:code:${email}`;
}

const generateRedisSMSCodeLotteryKey = (email) => {
    return `sms:code:${email}-lottery`;
}

module.exports = { generateRedisSMSCodeKey, generateRedisSMSCodeLotteryKey }