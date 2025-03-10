const jsyaml = require("js-yaml")
const path = require("path")
const { readFileSync } = require("fs")

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
module.exports = configs = jsyaml.load(readFileSync(path.join(__dirname, "./mailer.yaml"))).mail