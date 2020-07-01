FROM node:14.4.0-alpine3.12

RUN mkdir /home/bot
RUN addgroup -S bot && adduser -S bot -G bot

RUN chown -R bot:bot /home/bot
RUN chown -R bot:bot /usr/local

WORKDIR /a-jira-bot
RUN chown -R bot:bot /a-jira-bot

USER bot

RUN npm install -g nodemon
ENV VERSION=0.2

COPY package.json .
RUN npm install 

ADD . /a-jira-bot
CMD /a-jira-bot/start.sh 
