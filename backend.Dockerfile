# 基础阶段
FROM node:hydrogen-alpine3.19 as base-stage
# 安装pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry https://registry.npmmirror.com/

# 构建阶段
FROM base-stage as build-stage
# WORKDIR /app/backend
# # 分层构建，这些文件未变动便不会重新install
# COPY backend/package.json ./
# COPY backend/pnpm-lock.yaml ./
# COPY backend/pnpm-workspace.yaml ./
# # 安装依赖
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN ls node_modules
# # 复制其他文件
# WORKDIR /app
# COPY backend/ ./backend/
# COPY tsconfig.base.json ./
# COPY tsconfig.nest.json ./
# COPY .env .
# COPY .env.local .
# COPY .env.production .
# COPY .env.production.local .
# WORKDIR /app/backend
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN pnpm install
# prisma设置
RUN pnpm generate
# 打包
RUN pnpm build
# RUN pnpm deploy:prod
# 启动服务
CMD [ "pnpm", "start:prod" ]
