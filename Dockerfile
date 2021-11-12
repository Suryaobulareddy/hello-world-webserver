FROM node:latest

RUN pwd
#RUN npm install
COPY . .

CMD ["node", "server.js"]
