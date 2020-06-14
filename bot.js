const { 
    ActivityHandler, 
    MessageFactory } = require('botbuilder');

const { 
    ComponentDialog,
    WaterfallDialog,
    TextPrompt,
    DialogTurnStatus,
    DialogSet } = require('botbuilder-dialogs');

const { 
    MemoryStorage,
    ConversationState } = require('botbuilder-core');

const state = (new ConversationState( 
    new MemoryStorage())).createProperty('dialogState');

class MainDlg extends ComponentDialog {
    constructor() {
        super('MainDlg');

        this.addDialog( new WaterfallDialog( 'start',[

            async (step) => {
                return await step.prompt(
                    'namePrompt',
                    'What is your name?');
            }

        ]));

        this.addDialog( new TextPrompt( 'namePrompt' ));
    }
} 

class EchoBot extends ActivityHandler {

    constructor() {

        super();
        const dlg = new MainDlg();

        this.onMessage( async (context, next) => {

            const dlgSet = new DialogSet(state);
            dlgSet.add(dlg);

            const ctxt = await dlgSet.createContext(context);
            const res = await ctxt.continueDialog();

            console.log(res);

            if (res.status == DialogTurnStatus.empty) {
               const res1 = await ctxt.beginDialog(dlg.id);
               console.log(res1);
            }

            await next();

        });

        this.onMembersAdded(async (context, next) => {

            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hi, there!';

            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        MessageFactory.text(
                            welcomeText,
                            welcomeText));
                }
            }

            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
