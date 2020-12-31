const mongoose = require('mongoose')
const dbConfig = require('./dbconfig')

const connectDB = async(next) => {
    try {
        console.log(`Connecting to MongoDB...`)
        const db = await mongoose.connect(dbConfig.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDB Connected: ${db.connection.host}`)
        next(db)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB