FROM node:24-alpine AS builder
WORKDIR /srv/widget/backend
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /srv/widget/backend
COPY --from=builder /srv/widget/backend/dist ./dist
COPY config.json ./
COPY package*.json ./
RUN npm ci --silent --omit=dev
CMD ["npm", "start"]
