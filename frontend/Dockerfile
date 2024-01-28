FROM node:19 as build

COPY package.json /app/package.json
WORKDIR /app
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.21.1

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/dist
