const mongoose = require("mongoose")
// const {url}  = require('../config')
const url= process.env.MONGODB_URI
mongoose.set('useFindAndModify', false)
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result=>{
    console.log('connected to MongoDB')
}).catch(error=>{
    console.error('could not connect to MongoDB',error)
})

const tutorialSchema = new mongoose.Schema({
    title: String,
    content:{type:String,default:'empty'},
    published:{type:Boolean, default:false}
})
tutorialSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
module.exports = mongoose.model('Tutorial', tutorialSchema)