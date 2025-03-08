const { readFileSync } = require("fs")
const knex = require("knex")
const path = require("path")
const jsyaml = require("js-yaml")

const config = jsyaml.load(readFileSync(path.join(__dirname, "../configs/db.yaml")))

const db = knex({
    client: "mysql2",
    connection: config.db
})

db.schema.createTableIfNotExists("user", table => {
    table.increments("id")
    table.string("username")
    table.string("account")
    table.string("pwd")
})

module.exports = db;