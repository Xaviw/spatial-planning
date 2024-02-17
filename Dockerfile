# 分段构建-基础打包阶段
FROM node:hydrogen-alpine3.19 as build-stage
# 安装pnpm
RUN npm install -g pnpm
ENV NPM_CONFIG_PREFIX=/home/node/.pnpm-global
ENV PATH=$PATH:/home/node/.pnpm-global/bin
RUN pnpm config set registry https://registry.npmmirror.com/
# 设置工作目录
WORKDIR /app
# 分层构建，这些文件未变动便不会重新install
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
# RUN pnpm migrate
# 打包
RUN pnpm build:client
RUN pnpm build:manage
RUN pnpm build:backend

# 后端部署阶段
FROM node:hydrogen-alpine3.19
# 安装pnpm
RUN npm install -g pnpm
ENV NPM_CONFIG_PREFIX=/home/node/.pnpm-global
ENV PATH=$PATH:/home/node/.pnpm-global/bin
RUN pnpm config set registry https://registry.npmmirror.com/
# 设置工作目录
WORKDIR /app
# 安装后端运行时依赖
COPY backend/package.json ./
RUN pnpm install
# 复制后端文件
COPY --from=build-stage /app/dist/backend ./
RUN echo 'hello' > /app/file.txt
RUN echo 'hello' > ./file.txt
# 暴露端口
EXPOSE 3000
# 启动服务
CMD [ "node", "main.js" ]

# 前端部署阶段
FROM nginx:stable-alpine
# 设置工作目录
WORKDIR /app
# 复制前端文件
COPY --from=build-stage /app/dist/client /usr/share/nginx/html/client
COPY --from=build-stage /app/dist/manage /usr/share/nginx/html/manage
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80
# 启动服务
CMD ["nginx", "-g", "daemon off;"]
