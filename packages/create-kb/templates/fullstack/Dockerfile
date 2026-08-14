# Web 前端镜像
FROM node:22-alpine AS web
WORKDIR /app
COPY web/package.json ./
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run build

# API 服务镜像
FROM node:22-alpine AS api
WORKDIR /app
COPY server/package.json ./
RUN npm install --no-audit --no-fund
COPY server/ ./
EXPOSE 3000
CMD ["npm", "start"]
