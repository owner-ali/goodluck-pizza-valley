FROM node:22-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm install --omit=dev
COPY server/src ./src
COPY client/src/data/menu.sample.json ./client/src/data/menu.sample.json
RUN chmod -R 777 /app/src/uploads
ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/index.js"]