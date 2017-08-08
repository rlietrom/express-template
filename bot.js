var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';
console.log("BOT TOKEN", bot_token);
var rtm = new RtmClient(bot_token); //initializing slack library, listeners
var web = new WebClient(bot_token);
var axios = require('axios')
var API_AI_TOKEN = process.env.API_AI_TOKEN
let channel;
var { User } = require('./models');

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { channel = c.id }
    }
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
        rtm.sendMessage("Hello000s000ooooo!", channel);
    });

    rtm.on(RTM_EVENTS.MESSAGE, function(message) {
        var dm = rtm.dataStore.getDMByUserId(message.user)
        if(!dm || dm.id !== message.channel || message.type !== 'message') {
            return;
        }
        // rtm.sendMessage(message.text, message.channel)
        User.findOne({slackId: message.user})
        .then(function(user){
            if (! user) {
                return new User({
                    slackId: message.user,
                    slackDmId: message.channel
                    //make sure that you now have mlab setup.  this requires mongodb
                }).save()
            }
            return user;
        })
        .then(function(user){ //user must confirm or cancel before scheduling another one.
            if(!user.google || user.google.expiry_date < Date.now() ){
                var regex = /<@\w+>/g;
                var users = [];
                msg.text = msg.text.replace(regex, function(match){
                    var userId = match.slice(2, -1);
                    var user = rtm.dataStore.getUserById(userId);
                    users.push({
                        displayName: user.profile.real_name,
                        email: user.profile.email
                    });
                    console.log('Slack users', userId, user);
                    return user.profile.first_name || user.profile.real_name;
                });

                axios.get('https://api.api.ai/api/query', { //makes an http request to this url (just like ajax)
                    params: {
                        v: 20150910,
                        lang: 'en',
                        timezone: '2017-07-17T16:55:52-0700',
                        query: message.text,
                        sessionId: message.user,
                    },
                    headers: {
                        Authorization: `Bearer ${process.env.API_AI_TOKEN}`
                    }
                })
                .then(function({ data }) {
                    if(data.result.actionIncomplete) {
                        rtm.sendMessage(data.result.fulfillment.speech, message.channel);
                    }
                    else if (data.result.metadata.intentName === 'meeting:add'){
                        user.pending={
                            description : `meeting with ${data.result.parameters.who}`,
                            when :  data.result.parameters.when,
                            users : users,
                            active : true
                        }
                        user.save()
                        .then(function(u){
                            web.chat.postMessage(message.channel, `Scheduling a meeting with ${data.result.parameters.who} on ${data.result.parameters.date}`, {
                                "text": "Confirm this meeting???",
                                "attachments": [
                                    {
                                        "text": "Confirm this meeting?",
                                        "fallback": "You are unable to confirm",
                                        "callback_id": "meeting",
                                        "color": "#3AA3E3",
                                        "attachment_type": "default",
                                        "actions": [
                                            {
                                                "name": "confirm",
                                                "text": "confirm",
                                                "type": "button",
                                                "value": "true"
                                            },
                                            {
                                                "name": "cancel",
                                                "text": "cancel",
                                                "type": "button",
                                                "value": "false"
                                            }
                                        ]
                                    }
                                ]
                            })
                        })
                        .catch(function(e){
                            console.log(e, 'errorr----------')
                        })
                    }
                    else {
                        user.pending = {
                            subject: data.result.parameters.subject,
                            date: data.result.parameters.date
                        }

                        user.save();

                        web.chat.postMessage(message.channel, `Creating reminder for ${data.result.parameters.subject} on ${data.result.parameters.date}`, {
                            "text": "Confirm this reminder???",
                            "attachments": [
                                {
                                    "text": "Confirm this reminder?",
                                    "fallback": "You are unable to confirm",
                                    "callback_id": "reminder",
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                    "actions": [
                                        {
                                            "name": "confirm",
                                            "text": "confirm",
                                            "type": "button",
                                            "value": "true"
                                        },
                                        {
                                            "name": "cancel",
                                            "text": "cancel",
                                            "type": "button",
                                            "value": "false"
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                });
            });
        });


        rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
            console.log('Reaction added:', reaction);
        });

        rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
            console.log('Reaction removed:', reaction);
        });


        rtm.start();

        module.exports = {
            rtm,
            web
        }
