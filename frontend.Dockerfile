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
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY patches/ ./patches/
COPY client/package.json ./client/
COPY manage/package.json ./manage/
COPY packages/shared/package.json ./packages/shared/
COPY packages/vite-config/package.json ./packages/vite-config/
# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile
# 复制其他源文件
COPY . .
RUN ls
# 打包
RUN pnpm build:client
RUN pnpm build:manage

# 部署阶段
FROM nginx:stable-alpine
# 复制dist与nginx配置文件
COPY --from=build-stage /app/client/dist/ /usr/share/nginx/html/client/
COPY --from=build-stage /app/manage/dist/ /usr/share/nginx/html/manage/
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80
# 启动服务
CMD ["nginx", "-g", "daemon off;"]
