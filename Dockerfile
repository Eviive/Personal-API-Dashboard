FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN npm ci && \
    npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
