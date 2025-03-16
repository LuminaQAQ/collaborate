### 一、当前技术点可立即实现的功能及设计方案

#### **1. 核心功能需求**

- **用户系统**：注册、登录、退出、基础信息修改（头像、昵称）。
- **文档管理**：创建/编辑/删除文档、文档分类、Markdown 编辑器支持、版本历史（基础版本）。
- **权限控制**：文档的公开/私有设置、基础协作权限（所有者可编辑，其他人只读）。
- **文件上传**：图片/附件上传到本地服务器（后续可扩展至云存储）。
- **定时任务**：每日凌晨备份数据库（使用`node-schedule`）。
- **反向代理**：通过`http-proxy-middleware`实现 API 路由转发。

#### **2. 前端页面设计（Vue3 + ElementUI）**

| 页面            | 组件/功能                                                                |
| --------------- | ------------------------------------------------------------------------ |
| **登录/注册页** | 表单验证、JWT 令牌存储、错误提示。                                       |
| **文档列表页**  | 树形目录结构、文档搜索框、新建/删除文档按钮、权限状态标签（公开/私有）。 |
| **文档编辑页**  | Markdown 编辑器（如`@kangc/v-md-editor`）、保存按钮、版本历史抽屉面板。  |
| **用户设置页**  | 头像上传、昵称修改、密码修改表单。                                       |

---

### 二、后端接口列表（按功能分类）

#### **1. 用户模块**

| 接口         | 方法 | 路径            | 参数/请求体                             | 响应                      |
| ------------ | ---- | --------------- | --------------------------------------- | ------------------------- |
| 用户注册     | POST | `/api/register` | `{ username, password, email }`         | `{ success: true, user }` |
| 用户登录     | POST | `/api/login`    | `{ username, password }`                | `{ token, userInfo }`     |
| 获取用户信息 | GET  | `/api/user`     | Header: `Authorization: Bearer <token>` | `{ user }`                |
| 修改用户信息 | PUT  | `/api/user`     | `{ avatar?, nickname? }`                | `{ success: true }`       |

#### **2. 文档模块**

| 接口         | 方法   | 路径                       | 参数/请求体                    | 响应                   |
| ------------ | ------ | -------------------------- | ------------------------------ | ---------------------- |
| 创建文档     | POST   | `/api/docs`                | `{ title, content, isPublic }` | `{ docId }`            |
| 更新文档     | PUT    | `/api/docs/:docId`         | `{ content, isPublic? }`       | `{ success: true }`    |
| 获取文档列表 | GET    | `/api/docs`                | Query: `{ parentId? }`         | `{ list: Doc[] }`      |
| 删除文档     | DELETE | `/api/docs/:docId`         | -                              | `{ success: true }`    |
| 获取文档内容 | GET    | `/api/docs/:docId/content` | -                              | `{ content, history }` |

#### **3. 文件上传模块**

| 接口     | 方法 | 路径          | 参数/请求体      | 响应              |
| -------- | ---- | ------------- | ---------------- | ----------------- |
| 上传文件 | POST | `/api/upload` | FormData: `file` | `{ url: string }` |

##### **文档库管理接口**

| 接口描述       | 方法   | 路径                           | 参数/Headers/Body               | 响应格式                     | 权限       |
| -------------- | ------ | ------------------------------ | ------------------------------- | ---------------------------- | ---------- |
| 创建文档库     | POST   | `/api/v1/libraries`            | Body: `{ name, description? }`  | `{ libraryId, name }`        | 已登录用户 |
| 获取文档库列表 | GET    | `/api/v1/libraries`            | Query: `{ page=1, limit=10 }`   | `{ data: [library], total }` | 已登录用户 |
| 获取文档库详情 | GET    | `/api/v1/libraries/:libraryId` | -                               | `{ id, name, description }`  | 库权限校验 |
| 更新文档库     | PATCH  | `/api/v1/libraries/:libraryId` | Body: `{ name?, description? }` | `{ success: true }`          | 库所有者   |
| 删除文档库     | DELETE | `/api/v1/libraries/:libraryId` | -                               | `{ success: true }`          | 库所有者   |

##### **文档库权限接口**

| 接口描述       | 方法 | 路径                                       | 参数/Headers/Body              | 响应格式                 | 权限            |
| -------------- | ---- | ------------------------------------------ | ------------------------------ | ------------------------ | --------------- |
| 设置文档库权限 | POST | `/api/v1/libraries/:libraryId/permissions` | Body: `{ userId, permission }` | `{ success: true }`      | 库所有者        |
| 获取权限列表   | GET  | `/api/v1/libraries/:libraryId/permissions` | -                              | `{ data: [permission] }` | 库所有者/编辑者 |

---

### 三、数据库设计（MySQL）

#### **1. 用户表（`users`）**

| 字段         | 类型         | 说明                             |
| ------------ | ------------ | -------------------------------- |
| `id`         | INT(11)      | 主键，自增                       |
| `username`   | VARCHAR(50)  | 唯一                             |
| `password`   | VARCHAR(100) | 加密存储（bcrypt）               |
| `email`      | VARCHAR(100) | 唯一                             |
| `avatar`     | VARCHAR(200) | 头像 URL（默认值：系统默认头像） |
| `created_at` | DATETIME     | 创建时间                         |

#### **2. 文档表（`docs`）**

| 字段         | 类型         | 说明                               |
| ------------ | ------------ | ---------------------------------- |
| `id`         | INT(11)      | 主键，自增                         |
| `user_id`    | INT(11)      | 外键（关联`users.id`）             |
| `title`      | VARCHAR(100) | 文档标题                           |
| `content`    | TEXT         | Markdown 内容                      |
| `is_public`  | TINYINT(1)   | 是否公开（0:私有，1:公开）         |
| `parent_id`  | INT(11)      | 父文档 ID（支持树形结构）          |
| `library_id` | INT UNSIGNED | 所属文档库 ID（关联 libraries.id） |
| `updated_at` | DATETIME     | 最后更新时间                       |

#### **3. 文档历史表（`doc_histories`）**

| 字段         | 类型     | 说明                  |
| ------------ | -------- | --------------------- |
| `id`         | INT(11)  | 主键，自增            |
| `doc_id`     | INT(11)  | 外键（关联`docs.id`） |
| `content`    | TEXT     | 历史版本内容          |
| `created_at` | DATETIME | 版本保存时间          |

#### **4. 权限表（`permissions`）**

| 字段      | 类型                  | 说明                   |
| --------- | --------------------- | ---------------------- |
| `id`      | INT(11)               | 主键，自增             |
| `doc_id`  | INT(11)               | 外键（关联`docs.id`）  |
| `user_id` | INT(11)               | 外键（关联`users.id`） |
| `access`  | ENUM('read', 'write') | 权限类型               |

---

##### **5. 文档库表（libraries）**

| 字段名      | 类型         | 说明                       | 约束                        |
| ----------- | ------------ | -------------------------- | --------------------------- |
| id          | INT UNSIGNED | 文档库唯一 ID（主键）      | AUTO_INCREMENT, PK          |
| name        | VARCHAR(255) | 文档库名称                 | NOT NULL                    |
| creator_id  | INT UNSIGNED | 创建者 ID（关联 users.id） | NOT NULL, FK                |
| description | TEXT         | 文档库描述（可选）         | DEFAULT NULL                |
| created_at  | TIMESTAMP    | 创建时间                   | DEFAULT CURRENT_TIMESTAMP   |
| updated_at  | TIMESTAMP    | 最后更新时间               | ON UPDATE CURRENT_TIMESTAMP |

##### **6. 文档库权限表（library_permissions）**

| 字段名     | 类型                              | 说明                           | 约束                       |
| ---------- | --------------------------------- | ------------------------------ | -------------------------- |
| id         | INT UNSIGNED                      | 权限记录 ID（主键）            | AUTO_INCREMENT, PK         |
| library_id | INT UNSIGNED                      | 文档库 ID（关联 libraries.id） | NOT NULL, FK               |
| user_id    | INT UNSIGNED                      | 用户 ID（关联 users.id）       | NOT NULL, FK               |
| permission | ENUM('owner', 'editor', 'viewer') | 权限类型                       | NOT NULL, DEFAULT 'viewer' |

### 四、未来扩展功能需求

1. **实时协作**：集成`socket.io`实现多人协同编辑。
2. **高级权限**：RBAC（基于角色的访问控制）、团队管理。
3. **邮件通知**：使用`mail`库发送文档更新通知。
4. **全文搜索**：集成 Elasticsearch 或数据库全文索引。
5. **第三方登录**：GitHub/微信登录（OAuth2.0）。

---

### 五、扩展性设计建议

1. **分层架构**：Controller-Service-Model 分离，便于后续添加中间件或缓存逻辑（如 Redis 缓存热点文档）。
2. **统一错误处理**：中间件封装 HTTP 错误响应（404/500）。
3. **环境配置**：使用`dotenv`管理开发/生产环境变量。
4. **API 版本控制**：路径添加`/v1/`前缀，未来可升级到`/v2/`。

通过以上设计，当前可快速实现基础功能，同时为后续扩展留有充足空间。

---
