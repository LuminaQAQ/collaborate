const { readFileSync } = require("fs");
const jsyaml = require("js-yaml");
const path = require("path");

/**
 * @typedef DeepSeekOptions
 * @property {string} baseURL
 * @property {string} API_Key
 */

/**
 * @typedef options
 * @property {DeepSeekOptions} DeepSeek
 */
/**
 * @typedef configs
 * @property {options} ai
 */

/**
 * @type {configs}
 */
const configs = jsyaml.load(readFileSync(path.join(__dirname, "./ai.yaml")));

module.exports = configs;
