# 空间规划系统

> 提供数据信息和地图覆盖物展示与编辑的前台+后台+后端全栈项目

## 技术栈：

语言：typescript

前端：vue@3.4 + vite + unocss + ant-design-vue

后端：nest + mysql

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

# mysql链接，按实际服务配置
DATABASE_URL="mysql://root:password@localhost:3306/spatial_planning"

# JWT密钥
JWT_SECRET=xxx
```

4. 启动项目

```sh
# 创建以及初始化数据库
pnpm migrate

# 启动后端（或者在调试中选择”调试后端“启动）
pnpm dev:backend

# 启动前台
pnpm dev:client

# 启动后台
pnpm dev:manage
```
