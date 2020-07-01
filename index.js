const path = require('path');
const dotenv = require('dotenv');

const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const express = require('express');

const { BotFrameworkAdapter } = require('botbuilder');
const { DialogManager } = require('botbuilder-dialogs');
const { ResourceExplorer } = require('botbuilder-dialogs-declarative');
const { 
    AdaptiveDialogComponentRegistration 
} = require('botbuilder-dialogs-adaptive');

const { AJiraBot } = require('./bot');

const re = new ResourceExplorer().addFolder(
    `${__dirname}/dialogs`, 
    true,
    true);

re.addComponent(new AdaptiveDialogComponentRegistration(re));

const dlg = re.getResource('main.dialog');
console.log(`Dialog: ${dlg}`);

const type = re.loadType( dlg );
console.log(`Type: ${type}`);

const bot = new DialogManager(type);
console.log(`Bot: ${bot}`);

const server = express();
server.listen(process.env.port || process.env.PORT || 3978);

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
