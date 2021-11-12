FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Backend/package*.json ./
RUN yarn install
COPY Backend ./
RUN ls -l
CMD ["yarn", "start"]