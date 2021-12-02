FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Backend/package*.json ./
RUN yarn install
COPY Backend ./
RUN ls -l
EXPOSE 8080
CMD ["yarn", "prod"]