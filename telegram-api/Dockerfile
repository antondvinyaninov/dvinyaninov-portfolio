FROM node:18-alpine

WORKDIR /app

COPY telegram-api/package*.json ./

RUN npm install --production

COPY telegram-api/ .

EXPOSE 3001

CMD ["node", "index.js"]
