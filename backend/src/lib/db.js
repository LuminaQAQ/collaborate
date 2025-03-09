const { readFileSync } = require("fs")
const knex = require("knex")
const path = require("path")
const jsyaml = require("js-yaml")

const config = jsyaml.load(readFileSync(path.join(__dirname, "../configs/db.yaml")))

const db = knex({
    client: "mysql2",
    connection: config.db
})

module.exports = db;