var mongoose = require('mongoose');

var InstructorScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

InstructorScheme
    .virtual('url')
    .get(function () {
        return '/'+this._id
    });

module.exports = mongoose.model('Instructor',InstructorScheme);