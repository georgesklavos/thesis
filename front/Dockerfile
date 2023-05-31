FROM node:18.12.1-alpine as development

WORKDIR /usr/src/front

COPY package*.json ./

RUN npm install vue

RUN npm install

COPY . .

EXPOSE 8080

# FROM development as build

# RUN npm run build

# FROM nginx:1.23.2-alpine as production

# COPY --from=build /usr/src/back/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]