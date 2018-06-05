const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MatchSchema = new Schema({
     playerA:{
         type:String,
         required: true
     },
     playerB:{
         type:String,
         default:'AIPlayer'
     },
     winner:{
         type:String,
         required: true
     },
     game:{
         type:Schema.ObjectId,
         ref:'Game',
     }
});

module.exports = mongoose.model('Match', MatchSchema);