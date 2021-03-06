FROM node:10-alpine

RUN mkdir -p /usr/local/src/node_modules && chown -R node:node ~/usr/local/src/app/

WORKDIR /usr/local/src/app/

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080 8081

CMD [ "npm", "start" ]