FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Backend/package*.json ./
RUN npm install
COPY Backend ./
RUN ls -l
CMD ["npm", "start"]