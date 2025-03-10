const nodemailer = require("nodemailer")
const jsyaml = require("js-yaml")
const { readFileSync } = require("fs")
const path = require("path")

/**
 * @typedef {Object} AuthConfig
 * @property {string} user
 * @property {string} pass
 */
/**
 * @typedef TConfigs
 * @property {string} service
 * @property {string} host
 * @property {number} port
 * @property {boolean} secure
 * @property {AuthConfig} auth
 */

/**
 * 
 * @type {TConfigs} 
 */
const configs = jsyaml.load(readFileSync(path.join(__dirname, "../configs/mailer.yaml")))


const transport = nodemailer.createTransport(configs)

module.exports = transport;