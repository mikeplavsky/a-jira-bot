FROM node:14.4.0-alpine3.12

RUN mkdir /home/bot
RUN addgroup -S bot && adduser -S bot -G bot

RUN chown -R bot:bot /home/bot
RUN chown -R bot:bot /usr/local

WORKDIR /a-jira-bot
RUN chown -R bot:bot /a-jira-bot

USER bot

RUN npm install -g nodemon
COPY package.json .

ENV VERSION=0.1
RUN npm install 

ADD . /a-jira-bot
CMD ["npm","start"]
