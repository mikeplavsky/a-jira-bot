const { 
    ActivityHandler, 
    MessageFactory } = require('botbuilder');

const { 
    ComponentDialog,
    WaterfallDialog,
    ChoicePrompt,
    ChoiceFactory,
    DialogTurnStatus,
    DialogSet } = require('botbuilder-dialogs');

const { 
    MemoryStorage,
    ConversationState } = require('botbuilder-core');

const state = new ConversationState( 
    new MemoryStorage());
const dlg_state = state.createProperty('DialogState');

const PRODUCT="product";

class MainDlg extends ComponentDialog {
    constructor() {
        super('MainDlg');

        this.product = state.createProperty(PRODUCT);

        this.addDialog( new WaterfallDialog( 'start',[

            async (step) => {

                debugger;

                return await step.prompt(
                    'productPrompt',{
                    prompt: 'What is the product?',
                    choices: ChoiceFactory.toChoices(
                        ['RMAD', 'ODR'])});
            },
            
            async (step) => {
                return await step.endDialog(step);
            }            

        ]));

        this.addDialog( new ChoicePrompt( 'productPrompt' ));
    }
} 

class AJiraBot extends ActivityHandler {

    async run(context) {
        
        await super.run(context);
        await state.saveChanges(context, false);
        
    }

    constructor() {

        super();
        const dlg = new MainDlg();

        this.onMessage( async (context, next) => {

            const dlgSet = new DialogSet(dlg_state);
            dlgSet.add(dlg);

            const ctxt = await dlgSet.createContext(context);
            const res = await ctxt.continueDialog();

            if (res.status === DialogTurnStatus.empty) {
               await ctxt.beginDialog(dlg.id);
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

module.exports.AJiraBot = AJiraBot;
