var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI);

var User = mongoose.model('User', {
    slackId: {
        type: String,
        required: true
    },
    slackDmId: {
        type: String,
        required: true
    },
    google: {},
    pending: {
    }
});

var Reminder = mongoose.model('Reminder', {
    user: String,
    subject: String,
    date: String
});

module.exports = {
    User,
    Reminder
}
