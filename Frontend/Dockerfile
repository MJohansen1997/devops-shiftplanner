FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
RUN apk add git
RUN yarn add https://github.com/MJohansen1997/devops-shiftplanner
RUN ls -l
RUN yarn install
COPY Frontend ./
RUN ls -l
RUN yarn build
COPY Frontend/nodeServer.js nodeServer.js
EXPOSE 3000
CMD [ "node", "nodeServer.js" ]