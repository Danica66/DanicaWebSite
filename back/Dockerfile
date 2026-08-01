FROM node:24-alpine3.23

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "--import", "tsx", "app.ts"]
