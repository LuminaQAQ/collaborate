const { readFileSync } = require("fs")
const jsyaml = require("js-yaml");
const path = require("path");

/**
 * @typedef options
 * @property {string} secret 密钥
 */
/**
 * @typedef configs
 * @property {options} options
 */

/**
 * @type configs
 */
const configs = jsyaml.load(readFileSync(path.join(__dirname, "./jwt.yaml")));

module.exports = configs;