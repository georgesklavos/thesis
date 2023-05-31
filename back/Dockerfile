FROM node:18.12.1-alpine AS development

WORKDIR /usr/src/back

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN apk add ffmpeg

RUN npm run build

FROM node:18.12.1-alpine AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/back

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/back/dist ./dist

CMD ["node", "dist/main"]