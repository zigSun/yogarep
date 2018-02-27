var mongoose = require('mongoose');

var ClientScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone_number: {
        type: String,
        validate: {
            validator: function (v) {
                return /\+\d \d{3} \d{3}-\d{2}-\d{2}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'Требуется телефонный номер клиента']
    },
    status : {
        type : String,
        required: true, 
        enum: ['Подтвержден', 'Не подтвержден'], 
        default : 'Не подтвержден'
    }
});

ClientScheme
    .virtual('url')
    .get(function() {
        return '/'+this._id;
    })
module.exports = mongoose.model('Client',ClientScheme);