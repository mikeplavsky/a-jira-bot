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

class MainDlg extends ComponentDialog {
    constructor() {
        super('MainDlg');

        this.addDialog( new WaterfallDialog( 'start',[

            async (step) => {

                return await step.prompt(
                    'productPrompt',{
                    prompt: 'What is the product?',
                    choices: ChoiceFactory.toChoices(
                        ['RMAD', 'ODR'])});
            },
            
            async (step) => {

                console.log('Next step');
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

            console.log('on message');

            const dlgSet = new DialogSet(dlg_state);
            dlgSet.add(dlg);

            const ctxt = await dlgSet.createContext(context);
            const res = await ctxt.continueDialog();

            console.log(`from continue: ${res.status}`);

            if (res.status === DialogTurnStatus.empty) {

               const res1 = await ctxt.beginDialog(dlg.id);
               console.log(`starting ${res1.status}`);

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
