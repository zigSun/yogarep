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
};

exports.user_add_to_activity = [
    sanitizeBody('*').trim().escape(),
    function (req, res, next) {
        async.parallel({
            activity: function (callback) {
                Activity.findOne({
                    date: req.body.trainingdate,
                    time: req.body.trainingtime
                }).exec(callback);
            },
            client: function (callback) {
                Client.findOne({ name: req.body.memName })
                    .exec(callback);
            }
        }, function (err, results) {
            console.log(results);
            if (results.client == null) {
                
                Client.create({
                    name: req.body.memName,
                    phone_number: req.body.memPhone,
                    status: "Не подтвержден"
                }, function (err, new_client) {
                    if (err) { return next(err);}
                    results.activity.members.push(new_client);
                    results.activity.save(function (err, res_act) {
                        if (err) { return next(err); }
                        res.json({ success: true });
                    }); 
                })
            }
            else {
                console.log(results);
                results.activity.members.push(results.client);
                results.activity.save(function (err, res_act) {
                    if (err) { return next(err); }
                    res.json({ success: true });
                }); 
            }
        })
    }
]


exports.user_members_count = function (req,res,next) {
    Activity.findOne({
        date: req.body.trainingdate,
        time: req.body.trainingtime
    }).exec(function (err,results) {
        if(err) {return next(err);}
        if(typeof results.members !== undefined) {
            console.log(results);
            res.json({member_count:results.members.length});
        }
    })
}