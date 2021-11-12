FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
RUN ls -l
RUN npm install
COPY Frontend ./
RUN ls -l
RUN npm run build