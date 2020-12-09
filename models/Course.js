const mongoose = require('mongoose');


//each course should have many upvoters or downvoters

const CourseSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  link:{
    type:String,
    required:true
  },

  type:{
    type:String,
    required:true
  },

  source:{
    type:String,
    required:true
  },

  subject:{
    type:String,
    required:true
  },

  score:{
    type:Number,
    default:0
  },

  date:{
    type:Date,
    default:Date.now
  },
  voters:{
    type:Object,
    required:true
  },
  user:{
    type:String,
    required:true
  },
  weeds:{
    type:Number,
    required:true
  },
  savers:{
    type:Array,
    required:false
  },
  saved:{
    type:String,
    default:"no"
  }

});

const Course = mongoose.model('Course',CourseSchema);

module.exports = Course;
