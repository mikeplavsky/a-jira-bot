const path = require('path');
const dotenv = require('dotenv');

const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const express = require('express');

const { BotFrameworkAdapter } = require('botbuilder');
const { AJiraBot } = require('./bot');

const server = express();
server.listen(process.env.port || process.env.PORT || 3978);

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const myBot = new AJiraBot();

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await myBot.run(context);
    });
});
