docker run -ti  \
    --rm -v $(pwd):/a-jira-bot \
    -v /a-jira-bot/node_modules \
    -p 3978:3978 \
    -w /a-jira-bot \
    a-jira-bot bash

