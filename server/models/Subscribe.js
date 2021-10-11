const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var subscribeSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })


var Subscriber = mongoose.model('Subscriber', subscribeSchema);

module.exports = { Subscriber }