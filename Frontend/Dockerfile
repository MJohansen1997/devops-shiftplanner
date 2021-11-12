FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
RUN ls -l
RUN npm install
COPY Frontend ./
RUN ls -l
RUN npm run build
COPY Frontend/nodeServer.js nodeServer.js
EXPOSE 3000
CMD [ "node", "nodeServer.js" ]