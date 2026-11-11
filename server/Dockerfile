FROM node:22-alpine
WORKDIR /app
COPY server/package.json ./
RUN npm install --omit=dev
COPY server/src ./src
COPY client/src/data/menu.sample.json ./client/src/data/menu.sample.json
CMD ["node", "src/index.js"]
