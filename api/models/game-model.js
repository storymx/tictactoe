const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GameSchema = new Schema({
    humanPlayer: {
        type:String,
        required:true
    },
    humanPoints: {
        type:Number,
        required: true
    },
    AIPlayer:{
        type: String,
        required: true
    },
    AIPoints: {
        type:Number,
        required: true
    },
    historyMatch:[
        {
            type: Schema.ObjectId,
            ref: 'Match'
        }
    ],
    createdAt:{
        type:Date,
        required:false,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        required:false,
        default:Date.now
    }
});

module.exports= mongoose.model('Game', GameSchema);