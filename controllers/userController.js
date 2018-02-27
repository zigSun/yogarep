var Activity = require('../models/activity');
var Client = require('../models/client');
var Instructor = require('../models/instructor');
var Activity = require('../models/activity');
var async = require('async');
var moment = require('moment');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.user_week_get = function (req, res, next) {
    var title = req.params.num == 1 ? "Текущая неделя" : "Следующая неделя";
    //Текущие даты и время
    moment.locale('ru');
    var Dates = [];
    for (var day = 0; day < 7; day++) {
        Dates.push(moment().add(day, 'd').add(req.params.num - 1, 'w').format('ddd DD.MM.YY'));
    }
    //-------------------
    async.parallel({
        activities: function (callback) {
            Activity.find({ date: { $in: Dates } })
                .populate('instructor')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('userWeek', {
            title: title,
            dates: Dates,
            activities: results.activities,
        });
    });
}