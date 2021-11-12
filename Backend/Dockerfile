FROM node:lts-alpine
WORKDIR /usr/src/app
COPY Backend/package*.json ./
RUN npm ci
COPY Backend ./
RUN ls -l
CMD ["npm", "run", "prod"]