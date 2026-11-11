FROM node:22-alpine AS build
WORKDIR /app
COPY client/package.json ./
RUN npm install
COPY client ./
ENV VITE_API_URL=same-origin
RUN npm run build
FROM nginx:alpine
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
