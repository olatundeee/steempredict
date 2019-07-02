const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    status: String
})

module.exports = mongoose.model('status', statusSchema);