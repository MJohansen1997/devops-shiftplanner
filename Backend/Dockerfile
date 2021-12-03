FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Backend/package*.json ./
RUN yarn install
COPY Backend ./
RUN ls -l
ENV NODE_ENV production
EXPOSE 8080
CMD ["yarn", "prod"]