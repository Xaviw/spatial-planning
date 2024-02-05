# 分段构建-打包阶段
FROM node:18.0-alpine3.14 as build-stage
# 安装pnpm
RUN npm install -g pnpm
# 设置pnpm环境变量
ENV NPM_CONFIG_PREFIX=/home/node/.pnpm-global
ENV PATH=$PATH:/home/node/.pnpm-global/bin
# 设置国内镜像
RUN pnpm config set registry https://registry.npmmirror.com/
# 设置工作目录
WORKDIR /app
# 分层构建，这些文件未变动便会用缓存的node_modules
# COPY package.json .
# COPY pnpm-lock.yaml .
# COPY pnpm-workspace.yaml .
# COPY patches ./patches/
# COPY backend/package.json ./backend/
# COPY client/package.json ./client/
# COPY manage/package.json ./manage/
# COPY packages/shared/package.json ./packages/shared/
# COPY packages/vite-config/package.json ./packages/vite-config/
# 复制其他源代码
COPY . .
# 安装依赖
RUN pnpm install
# 初始化数据库
RUN pnpm migrate
# 打包
RUN pnpm build:client
RUN pnpm build:manage
RUN pnpm build:backend

# 安装后端需要的依赖
FROM node:18.0-alpine3.14 as install-stage
# 安装pnpm
RUN npm install -g pnpm
# 设置pnpm环境变量
ENV NPM_CONFIG_PREFIX=/home/node/.pnpm-global
ENV PATH=$PATH:/home/node/.pnpm-global/bin
# 设置国内镜像
RUN pnpm config set registry https://registry.npmmirror.com/
# 设置工作目录
WORKDIR /app
# 复制后端package.json
COPY backend/package.json .
# 安装后端必要的依赖
RUN pnpm install --production

# 部署阶段
FROM nginx:stable-alpine3.17-slim as deploy-stage

WORKDIR /app

COPY --from=build-stage /app/dist/client /usr/share/nginx/html/client
COPY --from=build-stage /app/dist/manage /usr/share/nginx/html/manage
COPY --from=build-stage /app/dist/backend /app
COPY --from=install-stage /app/node_modules /app/node_modules

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
