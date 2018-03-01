var mongoose = require('mongoose');

var ActivityScheme = new mongoose.Schema({
    date: {type: String, required:true},
    time: {type: String, required:true},
    timeStart: { type: String, required: true },
    timeEnd: { type: String, required: true },
    activity: { type: String, required: true },
    instructor: { type: mongoose.SchemaTypes.ObjectId,  ref: 'Instructor'},
    vacancy: { type: Number, required: true },
    members: [{ type: mongoose.SchemaTypes.ObjectId, ref : 'Client' }]
});

ActivityScheme
    .virtual('vacancy_left')
    .get(function () {
        return (this.vacancy - this.members.length);
    })
module.exports = mongoose.model("Activity",ActivityScheme);