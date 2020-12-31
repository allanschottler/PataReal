var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var petSchema = new Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Pet', petSchema)