FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
RUN ls -l
RUN npm install
COPY Frontend ./
RUN ls -l
RUN npm run build
COPY rontend/nodeServer.js server/nodeServer.js
WORKDIR /usr/src/app/server
EXPOSE 3000
CMD [ "node", "nodeServer.js" ]