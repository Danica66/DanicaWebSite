# 第一阶段：构建
FROM node:24-alpine3.23 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV VITE_API_BASE_URL=/api
ENV VITE_APP_TITLE=Danica
ENV VITE_TIMEOUT=10000
ENV VITE_DEBUG=false
ENV VITE_SITE_NAME=Danica
RUN npm run build-only

# 第二阶段：运行
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
RUN apk add --no-cache wget

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl /etc/nginx/ssl/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
