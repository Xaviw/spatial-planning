# 基础阶段
FROM node:hydrogen-alpine3.19 as base-stage
# 安装pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry https://registry.npmmirror.com/

# 构建阶段
FROM base-stage as build-stage
WORKDIR /app
# 分层构建，这些文件未变动便不会重新install
# COPY package.json .
# COPY pnpm-lock.yaml .
# COPY pnpm-workspace.yaml .
# COPY patches ./patches
# COPY client/package.json ./client/
# COPY manage/package.json ./manage/
# COPY backend/package.json ./backend/
# COPY packages/shared/package.json ./packages/shared/
# COPY packages/vite-config/package.json ./packages/vite-config/
# 复制其他源代码
COPY . .
# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm install --no-cache
# 打包
RUN pnpm build:client
RUN pnpm build:manage
WORKDIR /app/backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
# RUN pnpm install --no-cache
RUN pnpm build

# 前端部署阶段
FROM nginx:stable-alpine
# 复制前端文件
COPY --from=base-stage /app/client/dist /usr/share/nginx/html/client
COPY --from=base-stage /app/manage/dist /usr/share/nginx/html/manage
COPY --from=base-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80
# 启动服务
CMD ["nginx", "-g", "daemon off;"]

# 后端部署阶段
FROM base-stage
WORKDIR /app
# 复制后端文件
COPY --from=build-stage /app/backend/dist ./backend/dist
COPY backend/package.json ./backend/
COPY .env .
COPY .env.local .
COPY .env.production .
COPY .env.production.local .
WORKDIR /app/backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod
# RUN pnpm generate
# RUN pnpm install --no-cache
# 启动服务
CMD [ "pnpm", "start:prod" ]
