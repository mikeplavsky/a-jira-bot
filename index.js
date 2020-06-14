const path = require('path');
const dotenv = require('dotenv');

const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const restify = require('restify');

const { BotFrameworkAdapter } = require('botbuilder');
const { EchoBot } = require('./bot');

const server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(
        `\n${ server.name } listening to ${ server.url }`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const onTurnErrorHandler = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${ error }`);
    await context.sendActivity(
        `The bot encountered an error: ${error}`);
};

adapter.onTurnError = null;//onTurnErrorHandler;
const myBot = new EchoBot();

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await myBot.run(context);
    });
});
