# 空间规划系统

> 提供数据信息和地图覆盖物展示与编辑的前台+后台+后端全栈项目（pnpm monorepo）

[前台预览](https://xaviw.github.io/spatial-planning/client)
[后台预览](https://xaviw.github.io/spatial-planning/manage)

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
  <img src="./readme_images/client.png" alt="前台示例" />
  <img src="./readme_images/map-manage.png" alt="地图管理示例" />
  <img src="./readme_images/sider-manage.png" alt="侧边栏管理示例" />
</div>

**管理后台功能：**

1. 系统设置：设计地图基础参数等
2. 菜单管理
3. 侧边栏管理：可视化编辑菜单对应侧边栏数据

   物料组件包括：

   - 大标题
   - 小标题
   - 数据卡片
   - 主动脉瓣
   - 描述列表
   - 进度条
   - 表格
   - 文件列表
   - 轮播图
   - 饼图
   - 柱状图
   - 折线图
   - 时间轴

4. 地图管理：可视化编辑地图图层以及覆盖物

   覆盖物包括（基于[高德地图Web API](https://lbs.amap.com/api/javascript-api-v2/documentation)）：

   - 点标记
   - 文本标记
   - 文本标注
   - 灵活点标记
   - 折线
   - 曲线
   - 多边形
   - 四边形
   - 圆
   - 椭圆
   - 贴图

5. 账号设置

**前台功能：**

- 分菜单展示侧边栏与地图数据
- 点击覆盖物弹窗展示详情数据（若有配置）
- 点击图层图例切换图层显隐

## 技术栈：

语言：typescript

前端：vue@3.4 + vite + unocss + ant-design-vue

后端：nest + prisma + mysql

## 启动方式

1. 获取项目

```sh
git clone https://github.com/Xaviw/spatial-planning.git

cd spatial-planning

# 需要安装 pnpm
pnpm i
```

2. 开启 `mysql` 服务（本地安装或 `docker` 镜像等）

3. 添加必要环境变量

根目录创建 `.env.local` 文件并写入：

```
# 高德地图key，需要在高德地图开发者平台创建
VITE_AMAP_KEY=xxx

# 高德地图密钥，需要在高德地图开发者平台创建
VITE_AMAP_SECURITY_KEY=xxx

# JWT密钥
JWT_SECRET=xxx
```

根目录创建`.env.development.local`与`.env.production.local`文件并分别写入

```
# mysql链接，按实际服务配置，docker部署时主机地址切换为容器名
DATABASE_URL="mysql://account:password@host:port/spatial_planning"

# 本地环境配置示例：
# DATABASE_URL="mysql://root:123456@localhost:3306/spatial_planning"
# docker部署生产环境配置示例（database为本项目docker-compose中mysql容器的容器名）
# DATABASE_URL="mysql://root:123456@database:3306/spatial_planning"
```

4. 启动项目

```sh
# 创建以及初始化数据库
pnpm migrate

# 启动后端（或者在调试中选择”调试后端“启动）
pnpm dev:backend

# 启动前台
# 或 mock 环境启动：pnpm mock:client
pnpm dev:client

# 启动后台
# 或 mock 环境启动：pnpm mock:manage
pnpm dev:manage
```

## 部署方式

### docker部署

> 需要先安装 docker，镜像拉取过程可能需要连接外网

1. 根据需要修改 docker-compose.yml 中的端口映射（ports）、数据卷映射（volumes）、环境变量（environment）配置

2. 根据需要自定义 nginx.conf 文件

3. 执行 `docker-compose up`

### 手动部署

**默认账号密码：`admin` - `123456`**

```sh
# 前端前台打包
pnpm build:client

# 前端后台打包
pnpm build:manage

# 后端打包
pnpm build:backend

# 后端启动，会自动应用数据库迁移、数据库为空时填充基础数据、启动服务
pnpm deploy&seed&start
```

nest 默认部署方式仍然需要安装生产依赖，可以删除根 package.json中 的 dependencies 后执行 pnpm install --prod

部署时需要保留的文件包括：

- backend/dist
- backend/prisma
- backend/node_modules
- backend/package.json
- package.json
- node_modules
- .env
- .env.local
- .env.production
- .env.production.local
