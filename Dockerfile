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
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm build:client
RUN pnpm build:manage
RUN pnpm generate
RUN pnpm build:backend

# 前端部署阶段
FROM nginx:stable-alpine
COPY --from=build-stage /app/client/dist/ /usr/share/nginx/html/client/
COPY --from=build-stage /app/manage/dist/ /usr/share/nginx/html/manage/
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /app
COPY --from=build-stage /app/backend/dist/ ./backend/dist/
COPY --from=build-stage /app/backend/prisma/ ./backend/prisma/
COPY --from=build-stage /app/backend/package.json ./backend/
COPY --from=build-stage /app/backend/node_modules/ ./backend/node_modules/
COPY --from=build-stage /app/node_modules/ ./node_modules/
COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/.env ./
COPY --from=build-stage /app/.env.local ./
COPY --from=build-stage /app/.env.production ./
COPY --from=build-stage /app/.env.production.local ./
COPY --from=build-stage /app/start.sh ./
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD /app/start.sh
