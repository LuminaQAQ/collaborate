const db = require("../lib/db.js");

const current_time = () => {
    return new Date(Date.now()).toISOString().slice(0, 10);
}

const initUserTable = async () => {
    const isExists = await db.schema.hasTable("users")

    if (!isExists) {
        db.schema.createTable("users", table => {
            table.increments("id").primary().unique()
            table.string("username").unique().notNullable()
            table.string("email").unique().notNullable()
            table.string("password_hash").notNullable()
            table.integer("is_verified").notNullable().defaultTo(0)
            table.timestamp("created_at").defaultTo(current_time())
            table.timestamp("updated_at")
        }).catch(err => { throw err })
    }
}

const initDocsTable = async () => {
    const isExists = await db.schema.hasTable("docs")

    if (!isExists) {
        db.schema.createTable("docs", table => {
            table.increments("id").primary().unique().unsigned()
            table.string("title").notNullable()
            table.text("content").notNullable()
            table.integer("creator_id").notNullable().unsigned()
            table.timestamp("created_at").defaultTo(current_time())
            table.timestamp("updated_at").defaultTo(current_time())
        }).catch(err => { throw err })
    }
}

const initDocPermissionsTable = async () => {
    const isExists = await db.schema.hasTable("doc_permissions")

    if (!isExists) {
        db.schema.createTable("doc_permissions", table => {
            table.increments("id").primary().unsigned()
            table.integer("doc_id").notNullable().unsigned()
            table.integer("user_id").notNullable().unsigned()
            table.enum("permission", ["owner", "editor", "viewer"]).notNullable().defaultTo("viewer")
            table.timestamp("granted_at").defaultTo(current_time())
        }).catch(err => { throw err })
    }
}

const initFileTable = async () => {
    const isExists = await db.schema.hasTable("file")

    if (!isExists) {
        db.schema.createTable("file", table => {
            table.increments("id").primary().unsigned()
            table.string("filename").notNullable()
            table.string("path").notNullable()
            table.string("mime_type").notNullable()
            table.integer("size").notNullable().unsigned()
            table.integer("uploader_id").notNullable().unsigned()
            table.timestamp("created_at").defaultTo(current_time())
        }).catch(err => { throw err })
    }
}

const initTables = () => {
    initUserTable();
    initDocsTable();
    initDocPermissionsTable();
    initFileTable();
}

module.exports = initTables;