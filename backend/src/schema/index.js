const db = require("../lib/db.js");

const initUserTable = async () => {
  const isExists = await db.schema.hasTable("users");

  if (!isExists) {
    db.schema
      .createTable("users", (table) => {
        table.increments("id").primary().unique();
        table.string("username", 32).unique().notNullable();
        table.string("email", 32).unique().notNullable();
        table.string("password_hash").notNullable();
        table.string("avatar");
        table.integer("is_verified").notNullable().defaultTo(0);
        table.timestamp("created_at").defaultTo(db.fn.now());
        table
          .timestamp("updated_at")
          .defaultTo(db.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocsTable = async () => {
  const isExists = await db.schema.hasTable("docs");

  if (!isExists) {
    db.schema
      .createTable("docs", (table) => {
        table.increments("id").primary().unique().unsigned();
        table.string("title").notNullable();
        table.text("content").notNullable();
        table.integer("version").notNullable().defaultTo(1);
        table.integer("creator_id").notNullable().unsigned();
        table.integer("book_id").notNullable().unsigned();
        table.integer("parent_id").unsigned();
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
        table
          .timestamp("updated_at")
          .defaultTo(db.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocsVersionTable = async () => {
  const isExists = await db.schema.hasTable("docs_version");

  if (!isExists) {
    db.schema
      .createTable("docs_version", (table) => {
        table.increments("id").primary().unique().unsigned();
        table.integer("doc_id").notNullable().unsigned();
        table.integer("version").notNullable();
        table.string("title", 32).notNullable();
        table.text("content").notNullable();
        table.integer("creator_id").notNullable().unsigned();
        table.timestamp("created_at").defaultTo(db.fn.now());
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocPermissionsTable = async () => {
  const isExists = await db.schema.hasTable("doc_permissions");

  if (!isExists) {
    db.schema
      .createTable("doc_permissions", (table) => {
        table.increments("id").primary().unsigned();
        table.integer("doc_id").notNullable().unsigned();
        table.integer("user_id").notNullable().unsigned();
        table
          .enum("permission", ["owner", "editor", "viewer"])
          .notNullable()
          .defaultTo("viewer");
        table.timestamp("granted_at").defaultTo(db.fn.now());
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initBooksTable = async () => {
  const isExists = await db.schema.hasTable("books");

  if (!isExists) {
    db.schema
      .createTable("books", (table) => {
        table.increments("id").primary().unsigned();
        table.string("name").notNullable();
        table.string("description").notNullable();
        table.integer("creator_id").notNullable().unsigned();
        table.boolean("is_deleted").notNullable().defaultTo(false);
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initBookPermissionsTable = async () => {
  const isExists = await db.schema.hasTable("book_permissions");

  if (!isExists) {
    db.schema
      .createTable("book_permissions", (table) => {
        table.increments("id").primary().unsigned();
        table.integer("book_id").notNullable().unsigned();
        table.integer("user_id").notNullable().unsigned();
        table
          .enum("permission", ["owner", "editor", "viewer"])
          .notNullable()
          .defaultTo("viewer");
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocGroupTable = async () => {
  const isExists = await db.schema.hasTable("doc_group");

  if (!isExists) {
    db.schema
      .createTable("doc_group", (table) => {
        table.increments("id").primary().unsigned();
        table.string("title").notNullable();
        table.integer("parent_id").unsigned();
        table.boolean("is_deleted").notNullable().defaultTo(false);
        table.integer("book_id").notNullable().unsigned();
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocFavoritesTable = async () => {
  const isExists = await db.schema.hasTable("favorites");

  if (!isExists) {
    db.schema
      .createTable("favorites", (table) => {
        table.increments("id").primary().unsigned();
        table.integer("user_id").notNullable().unsigned();
        table.integer("group_id").unsigned();
        table.integer("target_id").notNullable().unsigned();
        table.enum("target_type", ["Doc", "Book"]).notNullable();
        table.timestamp("created_at").defaultTo(db.fn.now());
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocFavoriteGroupTable = async () => {
  const isExists = await db.schema.hasTable("favorite_group");

  if (!isExists) {
    db.schema
      .createTable("favorite_group", (table) => {
        table.increments("id").primary().unsigned().comment("分组id");
        table.string("name").notNullable().comment("分组名称");
        table.string("desc").notNullable().comment("分组描述");
        table
          .integer("user_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .comment("用户id");
      })
      .catch((err) => {
        throw err;
      });
  }
};

const initDocCommentsTable = async () => {
  const isExists = await db.schema.hasTable("doc_comments");

  if (!isExists) {
    return new Promise((resolve, reject) => {
      db.schema
        .createTable("doc_comments", (table) => {
          table.increments("id").primary();
          table.integer("doc_id").notNullable();
          table.integer("comment_user").notNullable();
          table.text("comment_content").notNullable();
          table.text("comment_quote").nullable();
          table.integer("parent_id").nullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        })
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }
};

const initCommentLikesTable = async () => {
  const isExists = await db.schema.hasTable("comment_likes");

  if (!isExists) {
    db.schema
      .createTable("comment_likes", (table) => {
        table.increments("id").primary();
        table
          .integer("comment_id")
          .notNullable()
          .references("id")
          .inTable("doc_comments")
          .onDelete("CASCADE");
        table.integer("user_id").notNullable();
        table.timestamp("liked_at").defaultTo(db.fn.now());

        table.unique(["comment_id", "user_id"]);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
};

const initTables = async () => {
  try {
    initUserTable();
    initDocsTable();
    initDocsVersionTable();
    initDocPermissionsTable();
    initBooksTable();
    initBookPermissionsTable();
    initDocGroupTable();
    initDocFavoritesTable();
    initDocFavoriteGroupTable();
    await initDocCommentsTable();
    initCommentLikesTable();
  } catch (error) {
    console.log(error);
  }
};

module.exports = initTables;
