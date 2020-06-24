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

USER root

RUN apk add openssh \
     && echo "root:Docker!" | chpasswd 

EXPOSE 8000 2222

ADD . /a-jira-bot
COPY sshd_config /etc/ssh/
RUN ssh-keygen -A

CMD /a-jira-bot/start.sh 
