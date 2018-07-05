FROM node:8.11.3-alpine

WORKDIR /usr/app

COPY . .
RUN npm install && cd ./src/client/ && npm install && npm run build --production && cd ../../
