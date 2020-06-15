docker run -ti  \
    --rm -v $(pwd):/a-jira-bot \
    -v /a-jira-bot/node_modules \
    -p 3978:3978 \
    -p 9229:9229 \
    -w /a-jira-bot \
    a-jira-bot bash

