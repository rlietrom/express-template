console.log('CRON RUNNING')
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';
var {User} = require('./models')
var {web} = require ('./bot')
var {Reminder} = require('./models')
var rtm = new RtmClient(bot_token);

//FIND ALL REMINDERS THAT ARE DUE TODAY OR TOMORROW

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    var today = moment().startOf('day')
    var tomorrow = moment(today).add(1, 'days')
  Reminder.find({date: {$gte: today.toDate(), $lt: tomorrow.toDate()}})
  .then(function(reminders) {
    console.log('REMINDERS', reminders)
    // reminders[0].user.slackId
  })

  rtm.sendMessage("sauce sequence initializing", channel);


});


User.findOne()
.then(function(user) {
  web.chat.postMessage(user.slackDmId, 'Current time is ' + new Date(),
  function() {
    process.exit(0)
  })
})
