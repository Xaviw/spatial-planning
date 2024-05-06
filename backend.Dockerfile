# 基础阶段
FROM node:20-alpine as base-stage
# 安装pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry https://registry.npmmirror.com/

# 构建阶段
FROM base-stage as build-stage
WORKDIR /app
# 分层构建，这些文件未变动便不会重新install
COPY backend/package.json ./backend/
COPY backend/prisma/ ./backend/prisma/
COPY pnpm-workspace.yaml ./
# 手动写入根package.json，避免安装前端依赖
RUN echo '{' >> ./package.json
RUN echo '"name": "spatial-planning",' >> ./package.json
RUN echo '"version": "1.0.0"' >> ./package.json
RUN echo '}' >> ./package.json
# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
# 复制其他文件
COPY backend/ ./backend/
COPY tsconfig.base.json ./
COPY tsconfig.nest.json ./
COPY .env .
COPY .env.local .
COPY .env.production .
COPY .env.production.local .
WORKDIR /app/backend
RUN pnpm prisma-generate
# 打包
RUN pnpm build
VOLUME [ "/app" ]
EXPOSE 3000
# 启动服务
CMD ["pnpm", "deploy-start"]
