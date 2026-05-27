FROM node:24-alpine AS builder
WORKDIR /srv/widget/frontend
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /srv/widget/frontend/dist /srv/widget/frontend/build
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
