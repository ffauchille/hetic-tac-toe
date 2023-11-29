FROM node:19-alpine3.14 as build

COPY package.json /app/package.json
WORKDIR /app
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.21.1-alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80