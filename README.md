# Calbot
A language-aware intelligent Slack bot for scheduling reminders and meetings with other Slack users in Google Calendar.

## APIs Used
* Google, Slack, API.AI, MongoDB.
* Managed OAuth flow from Slack and storing credentials in MongoDB.
* We trained API.AI to handle multiple intents for meetings and reminders.

## Interesting Parts About Building This
### Working on a Team
* There were many merge conflicts as it was our first time building something in Git with a team.
* It was hard knowing which API accounts to share and which to have separately while in the testing phases “configuring environments".
* It was hard not understanding all of the code that team members wrote.
* Trello was great for organization.
* Many laughs were made. Shoutout to Jilani and Reed for being awesome mates.
### Managing State
* user.pending: {} not showing up in MongoDB until it's filled once 
* user.action
* interesting fact: API.AI was capable of handling pending conversation state (could remember subject and date)
### Asynchronous Code
* The bugs it causes are hard to catch.
* “Race conditions”: if A comes before B but it’s not supposed to! 
* Often had to convert synchronous code to asynchronous (refracting).
* Integrated logic across many asynchronous APIs: Google Cal API and Slack Web API.
* Used promises: promise.all(), promisifying.
### Other Fun Learning Moments
* Deployed to Heroku and used Heroku Scheduler to time reminders
* Source Control
* Hella helper functions










