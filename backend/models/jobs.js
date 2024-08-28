const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  // companyPhoto will be automatically fetched when the user types the comapny name just like github feature
  company:{type:String,required:true},
  role:{type:String,required:true} ,
  description:{type:String} ,
  link:{type:String,required:true}
})

const Job = mongoose.model("Job",jobSchema) ;
module.exports = Job ;