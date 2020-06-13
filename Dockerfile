FROM node

RUN mkdir /home/bot
RUN groupadd -r bot && \
    useradd --no-log-init -r -g bot bot
RUN chown -R bot:bot /home/bot
RUN chown -R bot:bot /usr/local

USER bot
RUN npm install -g yo generator-botbuilder
