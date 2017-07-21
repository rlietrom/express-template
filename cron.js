console.log('CRON RUNNING')
var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';
var {User} = require('./models')
// var {web} = require ('./bot')
var {Reminder} = require('./models')
var rtm = new RtmClient(bot_token);
var web = new WebClient(bot_token);
var moment = require('moment');
var d = new Date();
//FIND ALL REMINDERS THAT ARE DUE TODAY OR TOMORROW
//
// date: {$gte: today.toDate(), $lt: tomorrow.toDate()}}

Reminder.find({date: d.toISOString().substring(0, 10)}) // 2017-07-20
  .then(function(reminders) { // return array of reminders
    console.log('LIST OF REMINDERS', reminders)
    reminders.forEach(function(reminder) {
      User.findOne({slackId: reminder.user})
        .then(function(user) {
          web.chat.postMessage(user.slackDMId,
            `:bell: You have the following reminder upcoming on ${Date(reminder.date).slice(0, 15)}: ${reminder.subject}.`
          )
        })
    }),
    function() {
      process.exit(0);
    }
  })

// var today = moment().startOf('day')
// var tomorrow = moment(today).add(1, 'days')
// // {date: {$gt: today.toDate(), $lt: tomorrow.toDate()}}
// console.log("about to start")
// Reminder.find({}).exec(function(err, reminders) {
//     console.log('heyyy', reminders)
//     reminders.map(reminder => {
//         web.chat.postMessage(reminder.user.slackDmId, `reminder: ${reminder.subject}`)
// })
// .then((reminders) => {
//
//     })
// })

    // rtm.sendMessage("sauce sequence initializing ${reminder}", user.slackDmId)
    /*User.findOne()
    .then(function(user) {
    web.chat.postMessage(user.slackDmId, 'Current time is ' + new Date(),
    function() {
    process.exit(0)
})
})*/


// reminders[0].user.slackId


// rtm.sendMessage("sauce sequence initializing", channel);
