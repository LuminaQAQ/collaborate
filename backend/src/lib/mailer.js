const nodemailer = require("nodemailer")

const configs = require("../configs/mailer.d.js")

const transport = nodemailer.createTransport(configs)

module.exports = transport;