FROM node

RUN mkdir /home/bot
RUN groupadd -r bot && \
    useradd --no-log-init -r -g bot bot
RUN chown -R bot:bot /home/bot
RUN chown -R bot:bot /usr/local

USER bot

RUN npm install -g yo generator-botbuilder
RUN npm install -g nodemon

WORKDIR /a-jira-bot

COPY package.json .
COPY package-lock.json .

ENV VERSION=0.1
RUN npm install 
