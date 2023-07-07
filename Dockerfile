FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.23-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/dist /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]