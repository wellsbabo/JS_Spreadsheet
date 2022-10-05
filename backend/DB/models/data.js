const mongoose = require('../mongo')

const dataSchema = new mongoose.Schema({
    /* time: {type: Date, default: Date.now}, */
    ipaddr: String,
    gname: String,
    etc: String,
    date: String,
})

module.exports = mongoose.model('data',dataSchema)