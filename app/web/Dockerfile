FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM build AS development

CMD ["yarn", "start"]

FROM nginx:alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
