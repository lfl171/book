# 灵境书阁 - 图书管理系统 后端开发文档

## 项目概述

**灵境书阁** 是一个现代化的智能图书馆管理系统，采用粒子灵动风格设计，深色星空主题，提供全面的数据可视化功能。

- **前端技术栈**: Vue 3 + Vite + Element Plus + ECharts + SCSS
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI框架**: Element Plus
- **图表**: ECharts 5
- **主题风格**: 深色科技风 + 粒子动画背景

---

## 界面截图参考

系统包含以下页面（截图位于 `图片/` 目录）：

| 页面 | 截图文件 | 说明 |
|------|----------|------|
| 管理员控制台 | 屏幕截图 2026-08-21 200440.png | 统计卡片、借阅趋势图、图书分类、快捷操作 |
| 图书管理 | 屏幕截图 2026-08-21 200529.png | 卡片式图书列表、搜索筛选、增删改查 |
| 读者管理 | 屏幕截图 2026-08-21 200545.png | 表格式读者列表、类型筛选、借阅进度 |
| 借阅管理 | 屏幕截图 2026-08-21 200559.png | 借阅记录表格、状态筛选、归还续借 |
| 数据统计 | 屏幕截图 2026-08-21 200617.png | 月度趋势、分类占比、读者分布、库存仪表盘 |
| 分类管理 | 屏幕截图 2026-08-21 200629.png | 分类卡片、图书数量统计 |
| 读者首页 | 屏幕截图 2026-08-21 200704.png | 简化版首页、借阅趋势、最近借阅 |
| 图书浏览 | 屏幕截图 2026-08-21 200718.png | 读者视角图书列表 |
| 我的借阅 | 屏幕截图 2026-08-21 200731.png | 读者借阅记录、归还续借 |
| 个人信息 | 屏幕截图 2026-08-21 200745.png | 读者资料修改、密码修改 |

---

## 系统功能模块

### 1. 控制台（Dashboard）- 仅管理员

**界面说明**：管理员登录后显示的主控面板

**功能要素**：
- **欢迎区域**：显示"欢迎回来，管理员"+ 当前日期
- **统计卡片**（4个）：
  - 馆藏图书（蓝色图标，显示总数+增长率）
  - 注册读者（青色图标，显示总数+增长率）
  - 在借图书（紫色图标，显示总数+借阅率）
  - 逾期未还（红色图标，显示数量）
- **借阅趋势图**：折线图，显示12个月借出/归还趋势
- **图书分类**：网格展示6个分类（计算机/文学/历史/科学/艺术/经济）及各自数量
- **最近借阅**：最近5条借阅记录列表
- **快捷操作**：新增图书、添加读者、办理借阅

---

### 2. 图书管理（Books）

**界面说明**：卡片式布局展示所有图书

**功能要素**：
- **顶部操作**：+新增图书按钮、导出数据按钮
- **筛选栏**：
  - 搜索框（支持书名、作者、ISBN）
  - 分类下拉选择
  - 库存状态下拉选择（充足/紧张/缺货）
- **图书卡片**：
  - 封面占位图
  - ISBN标签（右上角）
  - 书名、作者
  - 分类标签、价格
  - 库存进度条（绿色充足/黄色紧张/红色缺货）
  - 编辑/删除按钮

---

### 3. 读者管理（Readers）- 仅管理员

**界面说明**：表格布局展示所有读者

**功能要素**：
- **顶部操作**：+添加读者按钮
- **筛选栏**：
  - 搜索框（支持姓名、手机号）
  - 读者类型下拉（普通读者/VIP读者/学生读者/教师读者）
  - 状态下拉（正常/冻结）
- **表格列**：
  - 读者信息（头像+姓名+手机号）
  - 邮箱
  - 读者类型（彩色标签）
  - 借阅情况（进度条+数值，如 2/5）
  - 累计借阅数
  - 注册日期
  - 状态（正常/冻结标签）
  - 操作（编辑/删除）

---

### 4. 借阅管理（Borrow）- 仅管理员

**界面说明**：表格布局展示所有借阅记录

**功能要素**：
- **顶部操作**：+办理借阅按钮
- **筛选栏**：
  - 搜索框（支持书名、读者姓名）
  - 借阅状态下拉（借阅中/已归还/逾期）
- **表格列**：
  - 图书信息（封面+书名+借阅人）
  - 借阅日期
  - 应还日期
  - 归还日期（未归还显示"-"）
  - 状态（借阅中-蓝色/已归还-绿色/逾期-红色）
  - 续借次数
  - 操作（归还-绿色/续借-橙色）

**办理借阅弹窗**：
- 选择图书列表（显示可借数量）
- 选择读者列表（显示已借/上限）

---

### 5. 数据统计（Statistics）- 仅管理员

**界面说明**：多图表可视化展示

**功能要素**：
- **顶部概览卡片**：馆藏总量、活跃读者、在借图书、借阅率
- **图表区域**（2x2布局）：
  - 月度借阅趋势（折线图，借出+归还）
  - 分类借阅占比（环形饼图）
  - 读者类型分布（柱状图）
  - 图书库存状态（仪表盘，显示借阅率百分比）
- **热力图**：每日借阅量热力图（按周/时段）

---

### 6. 分类管理（Categories）- 仅管理员

**界面说明**：卡片式布局展示所有分类

**功能要素**：
- **顶部操作**：+新增分类按钮
- **分类卡片**：
  - 分类图标（不同颜色背景）
  - 编辑/删除按钮
  - 分类名称
  - 图书数量（大号数字）
  - 数量进度条（按比例显示）

**默认分类**：
| 分类 | 图标 | 颜色 | 初始数量 |
|------|------|------|----------|
| 计算机 | Monitor | #6366f1 | 45 |
| 文学 | Notebook | #06b6d4 | 38 |
| 历史 | Clock | #f472b6 | 22 |
| 科学 | Aim | #10b981 | 18 |
| 艺术 | Picture | #f59e0b | 15 |
| 经济 | TrendCharts | #8b5cf6 | 12 |

---

### 7. 读者首页（UserHome）- 仅读者

**界面说明**：简化版首页，展示借阅相关信息

**功能要素**：
- **欢迎区域**：显示"欢迎回来，[用户名]"+ 统计（在借图书/馆藏图书）
- **热门图书推荐**：6本图书卡片
- **快速操作**：搜索图书、我的借阅、个人信息

---

### 8. 图书浏览（Books）- 读者

**界面说明**：与管理员图书管理界面相同，但无增删改权限

---

### 9. 我的借阅（MyBorrow）- 仅读者

**界面说明**：展示当前读者的借阅记录

**功能要素**：
- **统计卡片**：
  - 借阅中数量
  - 已归还数量
  - 逾期数量
- **筛选**：借阅状态下拉
- **借阅记录列表**：
  - 图书封面+书名
  - 借阅日期、应还日期
  - 状态标签（借阅中/已归还/逾期）
  - 剩余天数/逾期天数
  - 归还/续借按钮

---

### 10. 个人信息（MyProfile）- 仅读者

**界面说明**：展示和修改读者个人信息

**功能要素**：
- **个人信息卡片**：
  - 头像（姓氏首字）
  - 姓名、读者类型标签
  - 统计：累计借阅、在借图书、注册日期
- **修改信息表单**：
  - 姓名
  - 手机号
  - 邮箱
  - 保存修改按钮
- **修改密码表单**：
  - 当前密码
  - 新密码
  - 确认密码
  - 修改密码按钮

---

### 11. 登录页面

**界面说明**：系统登录入口

**功能要素**：
- 系统Logo（动态SVG）
- 系统名称"灵境书阁"
- 角色选择Tab（管理员登录/读者登录）
- 用户名输入框
- 密码输入框（支持显示/隐藏）
- 记住我复选框
- 登录按钮（根据角色显示不同颜色）
- 测试账号快速填入

**测试账号**：
| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 读者 | user | 123456 |
| 读者 | lisi | 123456 |

---

## 角色权限系统

### 管理员角色（admin）

| 功能模块 | 菜单 | 操作权限 |
|----------|------|----------|
| 控制台 | ✅ | 查看统计、图表 |
| 图书管理 | ✅ | 增删改查、导出 |
| 读者管理 | ✅ | 增删改查 |
| 借阅管理 | ✅ | 办理借阅、归还、续借 |
| 数据统计 | ✅ | 查看所有图表 |
| 分类管理 | ✅ | 增删改查 |

### 读者角色（user）

| 功能模块 | 菜单 | 操作权限 |
|----------|------|----------|
| 首页 | ✅ | 查看推荐 |
| 图书浏览 | ✅ | 只读 |
| 我的借阅 | ✅ | 查看自己的记录、归还、续借 |
| 个人信息 | ✅ | 查看/修改个人资料、修改密码 |

---

## API 接口设计

### 基础信息

- **Base URL**: `/api/v1`
- **认证方式**: JWT Token（Bearer）
- **请求格式**: JSON
- **响应格式**: JSON

### 通用响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 接口详情

### 权限说明

| 接口 | 管理员(admin) | 读者(user) |
|------|:------------:|:----------:|
| 认证模块 | ✅ | ✅ |
| 图书列表/详情 | ✅ | ✅ |
| 图书增删改 | ✅ | ❌ |
| 读者管理 | ✅ | ❌ |
| 借阅管理（全部） | ✅ | ❌ |
| 我的借阅 | ❌ | ✅ |
| 分类管理 | ✅ | ❌ |
| 统计模块 | ✅ | ❌ |

---

### 一、认证模块

#### 1.1 用户登录
```
POST /api/v1/auth/login
```

**请求体**:
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "name": "系统管理员",
      "role": "admin",
      "phone": "138****0001",
      "avatar": "",
      "joinDate": "2024-01-01"
    }
  }
}
```

#### 1.2 获取当前用户信息
```
GET /api/v1/auth/userinfo
Authorization: Bearer {token}
```

#### 1.3 退出登录
```
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

#### 1.4 修改密码
```
PUT /api/v1/auth/password
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

---

### 二、图书模块

#### 2.1 获取图书列表
```
GET /api/v1/books?page=1&pageSize=20&keyword=&category=&status=
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |
| keyword | string | 否 | 搜索关键词（书名/作者/ISBN） |
| category | string | 否 | 分类名称 |
| status | string | 否 | 库存状态：充足/紧张/缺货 |

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "isbn": "978-7-111-40701-0",
        "title": "深入理解计算机系统",
        "author": "Randal E. Bryant",
        "publisher": "机械工业出版社",
        "category": "计算机",
        "total": 10,
        "available": 7,
        "cover": "",
        "publishDate": "2016-11-01",
        "price": 139.00
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 2.2 获取图书详情
```
GET /api/v1/books/:id
```

#### 2.3 新增图书
```
POST /api/v1/books
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "isbn": "978-7-111-40701-0",
  "title": "深入理解计算机系统",
  "author": "Randal E. Bryant",
  "publisher": "机械工业出版社",
  "category": "计算机",
  "total": 10,
  "available": 10,
  "cover": "",
  "publishDate": "2016-11-01",
  "price": 139.00
}
```

#### 2.4 更新图书
```
PUT /api/v1/books/:id
Authorization: Bearer {token}
```

#### 2.5 删除图书
```
DELETE /api/v1/books/:id
Authorization: Bearer {token}
```

#### 2.6 导出图书数据
```
GET /api/v1/books/export?keyword=&category=
Authorization: Bearer {token}
```
返回 Excel 文件流

---

### 三、读者模块

#### 3.1 获取读者列表
```
GET /api/v1/readers?page=1&pageSize=20&keyword=&type=&status=
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |
| keyword | string | 否 | 搜索关键词（姓名/手机号） |
| type | string | 否 | 读者类型 |
| status | string | 否 | 状态 |

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "张三",
        "phone": "138****1234",
        "email": "zhangsan@email.com",
        "type": "普通读者",
        "borrowLimit": 5,
        "currentBorrow": 2,
        "totalBorrow": 15,
        "joinDate": "2023-01-15",
        "status": "正常"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 3.2 获取读者详情
```
GET /api/v1/readers/:id
```

#### 3.3 新增读者
```
POST /api/v1/readers
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "name": "张三",
  "phone": "13812341234",
  "email": "zhangsan@email.com",
  "type": "普通读者",
  "borrowLimit": 5
}
```

**读者类型与借阅上限**:
| 读者类型 | 默认借阅上限 |
|----------|--------------|
| 普通读者 | 5 |
| VIP读者 | 10 |
| 学生读者 | 3 |
| 教师读者 | 15 |

#### 3.4 更新读者
```
PUT /api/v1/readers/:id
Authorization: Bearer {token}
```

#### 3.5 删除读者
```
DELETE /api/v1/readers/:id
Authorization: Bearer {token}
```

---

### 四、借阅模块

#### 4.1 获取借阅记录列表（管理员查看全部）
```
GET /api/v1/borrows?page=1&pageSize=20&keyword=&status=
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "bookId": 1,
        "bookTitle": "深入理解计算机系统",
        "readerId": 1,
        "readerName": "张三",
        "borrowDate": "2024-01-10",
        "dueDate": "2024-02-10",
        "returnDate": null,
        "status": "借阅中",
        "renewCount": 0
      }
    ],
    "total": 200,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 4.2 获取我的借阅记录（读者查看自己的）
```
GET /api/v1/borrows/my?page=1&pageSize=20&status=
Authorization: Bearer {token}
```

#### 4.3 办理借阅
```
POST /api/v1/borrows
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "bookId": 1,
  "readerId": 1
}
```

**业务规则**:
- 图书可借数量 > 0
- 读者当前借阅数 < 借阅上限
- 借阅期限默认30天
- 自动更新图书available数量和读者currentBorrow数量

#### 4.4 归还图书
```
PUT /api/v1/borrows/:id/return
Authorization: Bearer {token}
```

**业务规则**:
- 设置returnDate为当前日期
- 更新status为"已归还"
- 更新图书available数量+1
- 更新读者currentBorrow数量-1

#### 4.5 续借图书
```
PUT /api/v1/borrows/:id/renew
Authorization: Bearer {token}
```

**业务规则**:
- 每次续借延长30天
- 每本书最多续借2次
- 更新renewCount+1
- 更新dueDate

---

### 五、分类模块

#### 5.1 获取分类列表
```
GET /api/v1/categories
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "计算机",
      "count": 45,
      "icon": "Monitor",
      "color": "#6366f1"
    }
  ]
}
```

#### 5.2 新增分类
```
POST /api/v1/categories
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "name": "计算机",
  "icon": "Monitor",
  "color": "#6366f1"
}
```

#### 5.3 更新分类
```
PUT /api/v1/categories/:id
Authorization: Bearer {token}
```

#### 5.4 删除分类
```
DELETE /api/v1/categories/:id
Authorization: Bearer {token}
```

---

### 六、统计模块

#### 6.1 获取概览统计
```
GET /api/v1/statistics/overview
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "totalBooks": 89,
    "availableBooks": 69,
    "borrowedBooks": 20,
    "totalReaders": 5,
    "activeBorrows": 18,
    "overdueBorrows": 1,
    "borrowRate": "22.5"
  }
}
```

#### 6.2 获取月度借阅趋势
```
GET /api/v1/statistics/monthly-trend?year=2024
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "months": ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    "borrow": [32,28,45,56,48,62,78,85,72,68,58,42],
    "return": [28,35,40,52,45,58,72,80,68,62,52,38]
  }
}
```

#### 6.3 获取分类借阅占比
```
GET /api/v1/statistics/category-ratio
```

**响应**:
```json
{
  "code": 200,
  "data": [
    { "name": "计算机", "value": 45, "color": "#6366f1" },
    { "name": "文学", "value": 38, "color": "#06b6d4" },
    { "name": "历史", "value": 22, "color": "#f472b6" },
    { "name": "科学", "value": 18, "color": "#10b981" },
    { "name": "艺术", "value": 15, "color": "#f59e0b" },
    { "name": "经济", "value": 12, "color": "#8b5cf6" }
  ]
}
```

#### 6.4 获取读者类型分布
```
GET /api/v1/statistics/reader-type-distribution
```

**响应**:
```json
{
  "code": 200,
  "data": [
    { "type": "普通读者", "count": 2 },
    { "type": "VIP读者", "count": 1 },
    { "type": "学生读者", "count": 1 },
    { "type": "教师读者", "count": 1 }
  ]
}
```

#### 6.5 获取每日借阅热力图数据
```
GET /api/v1/statistics/daily-heatmap?startDate=2024-01-01&endDate=2024-01-31
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "days": ["周一","周二","周三","周四","周五","周六","周日"],
    "hours": ["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
    "values": [[0,0,5],[1,0,8],[2,0,12],[3,0,8],[4,0,15],[5,0,20],[6,0,18]]
  }
}
```

---

## 数据库设计

### books 表（图书表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| isbn | VARCHAR(20) | ISBN编号，唯一 |
| title | VARCHAR(200) | 书名 |
| author | VARCHAR(100) | 作者 |
| publisher | VARCHAR(200) | 出版社 |
| category_id | INT | 分类ID，外键 |
| total | INT | 总数量 |
| available | INT | 可借数量 |
| cover | VARCHAR(500) | 封面图片URL |
| publish_date | DATE | 出版日期 |
| price | DECIMAL(10,2) | 价格 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### readers 表（读者表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 姓名 |
| phone | VARCHAR(20) | 手机号，唯一 |
| email | VARCHAR(100) | 邮箱 |
| type | ENUM('普通读者','VIP读者','学生读者','教师读者') | 读者类型 |
| borrow_limit | INT | 借阅上限 |
| current_borrow | INT | 当前借阅数 |
| total_borrow | INT | 累计借阅数 |
| status | ENUM('正常','冻结') | 状态 |
| created_at | DATETIME | 注册时间 |

### borrow_records 表（借阅记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| book_id | INT | 图书ID，外键 |
| reader_id | INT | 读者ID，外键 |
| borrow_date | DATE | 借阅日期 |
| due_date | DATE | 应还日期 |
| return_date | DATE | 归还日期，可为空 |
| status | ENUM('借阅中','已归还','逾期') | 状态 |
| renew_count | INT | 续借次数，默认0 |
| created_at | DATETIME | 创建时间 |

### categories 表（分类表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 分类名称，唯一 |
| icon | VARCHAR(50) | Element Plus图标名 |
| color | VARCHAR(20) | 主题颜色（HEX） |
| created_at | DATETIME | 创建时间 |

### users 表（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码（bcrypt加密） |
| name | VARCHAR(50) | 显示名称 |
| role | ENUM('admin','user') | 角色：admin-管理员，user-读者 |
| phone | VARCHAR(20) | 手机号 |
| email | VARCHAR(100) | 邮箱 |
| avatar | VARCHAR(500) | 头像URL |
| join_date | DATE | 注册日期 |
| created_at | DATETIME | 创建时间 |

---

## 推荐技术方案

### 后端框架
- **Java**: Spring Boot 3 + MyBatis-Plus
- **Node.js**: Express/Koa + Prisma
- **Python**: FastAPI + SQLAlchemy

### 数据库
- MySQL 8.0 / PostgreSQL 15

### 缓存
- Redis（用于Token存储、热门图书缓存）

### 文件存储
- 本地存储 / 阿里云OSS / MinIO

---

## 开发约定

### 1. RESTful 规范
- GET: 查询资源
- POST: 创建资源
- PUT: 更新资源
- DELETE: 删除资源

### 2. 分页参数
- `page`: 页码（从1开始）
- `pageSize`: 每页数量（默认20，最大100）

### 3. 时间格式
- 统一使用 ISO 8601 格式: `2024-01-15T10:30:00Z`
- 日期格式: `YYYY-MM-DD`

### 4. 金额处理
- 使用 Decimal 类型，精度为2位小数
- 单位：元（CNY）

### 5. 手机号脱敏
- 列表展示时：`138****1234`
- 详情接口返回完整手机号

---

## 测试账号

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 管理员 | admin | 123456 | 全部权限 |
| 读者 | user | 123456 | 浏览图书、借阅管理、个人信息 |
| 读者 | lisi | 123456 | 浏览图书、借阅管理、个人信息 |

---

## 前端项目启动

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

---

## 项目文件结构

```
src/
├── main.js                    # 应用入口
├── App.vue                    # 根组件
├── router/index.js            # 路由配置
├── stores/
│   ├── index.js               # 图书/读者/借阅数据Store
│   └── user.js                # 用户认证Store
├── styles/
│   ├── variables.scss         # 主题变量
│   └── main.scss              # 全局样式
├── components/
│   └── ParticleBackground.vue # 粒子动画背景
├── layouts/
│   ├── MainLayout.vue         # 主布局
│   └── MainLayout.scss
└── views/
    ├── Dashboard.vue/scss     # 管理员控制台
    ├── Books.vue/scss         # 图书管理
    ├── Readers.vue/scss       # 读者管理
    ├── Borrow.vue/scss        # 借阅管理
    ├── Statistics.vue/scss    # 数据统计
    ├── Categories.vue/scss    # 分类管理
    ├── UserHome.vue/scss      # 读者首页
    ├── MyBorrow.vue/scss      # 我的借阅
    ├── MyProfile.vue/scss     # 个人信息
    └── Login.vue/scss         # 登录页
```

---

## 联系方式

如有疑问，评论去提问
