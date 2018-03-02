var AdminUser = require('../models/adminUser');
var Client = require('../models/client');
var Instructor = require('../models/instructor');
var Activity = require('../models/activity');

var async = require('async');
var moment = require('moment');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.admin_create_get = function (req, res, next) {
    res.render('adminUserCreate', { title: "Создать администратора" });
}
exports.admin_create_post = [
    body('username').isAlphanumeric().withMessage('Допускаются только буквы и цифры').isLength({ min: 1 }).withMessage('Введите имя пользователя'),
    body('password').isLength({ min: 6 }).withMessage('Неверный пароль').isAlphanumeric().withMessage('Использованы недопустимые символы'),

    sanitizeBody('username').trim().escape(),
    sanitizeBody('password').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (req.body.username &&
            req.body.password) {
            var adminData = {
                username: req.body.username,
                password: req.body.password
            }
        }
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('adminUserCreate', { title: 'Cоздать администратора', errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Author with same name already exists.
            AdminUser.create(adminData, function (err, admin) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                req.session.userId = admin._id
                res.redirect('/admin/week1');
            });
        }

    }
]

exports.auth_get = function (req, res, next) {
    res.render('adminLogIn', { title: "Авторизация пользователя" });
}

exports.auth_post = [
    body('username').isAlphanumeric().withMessage('Допускаются только буквы и цифры').isLength({ min: 1 }).withMessage('Введите имя пользователя'),
    body('password').isLength({ min: 6 }).withMessage('Неверный пароль').isAlphanumeric().withMessage('Использованы недопустимые символы'),

    sanitizeBody('username').trim().escape(),
    sanitizeBody('password').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        AdminUser.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/admin');
            }
        });
    }
]

exports.instructors_get = function (req, res, next) {
    Instructor.find({})
        .exec(function (err, result) {
            if (err) { return next(err); }
            res.render('adminInstructors', { title: 'Инструкторы', user: req.session.userId, instructor_list: result });
        })
}

exports.instructors_add_post = [
    body('instructor_name').isAlpha().withMessage('Имя может содержать только буквы').isLength({ min: 1 }).withMessage('Введите имя и фамилию инструктора'),
    sanitizeBody('instructor_name').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (req.body.instructor_name) {
            var instructorData = {
                name: req.body.instructor_name
            }
        }
        Instructor.create(instructorData, function (err, result) {
            if (err) { return next(err) }
            res.redirect('/admin/instructors');
        })
    }
];
exports.instructors_delete = function (req, res, next) {
    Instructor.findByIdAndRemove(req.params.id)
        .exec(function (err, result) {
            if (err) { return next(err); }
            res.redirect('/admin/instructors');
        })
};

exports.clients_get = function (req, res, next) {
    Client.find({})
        .exec(function (err, result) {
            if (err) { return next(err); }
            res.render('adminClients', { title: 'Клиенты', user: req.session.userId, client_list: result });
        });
};

exports.search_member = function (req,res,next) {
    var regex = new RegExp(req.query["name"], 'i');
    console.log(req.query.name);
    Client.find({'name': regex},'name phone_number').limit(20).exec(function (err,result) {
        if(err) {return next(err);}
        console.log(result);
        res.json({"query": "Unit", "suggestions" : result});      
    });
};

exports.clients_add_post = [
    body('client_name').isLength({ min: 1 }).withMessage('Введите имя и фамилию клиента'),
    body('client_phone').isLength({ min: 11 }).withMessage('Неверно введен номер'),
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            Client.find({})
                .exec(function (err, result) {
                    if (err) { return next(err); }
                    res.render('adminClients', { title: 'Клиенты', user: req.session.userId, client_list: result, errors: errors.array() });
                });
        }
        var clientData = {
            name: req.body.client_name,
            phone_number: req.body.client_phone,
            status: 'Подтвержден'
        }
        Client.create(clientData, function (err, result) {
            if (err) { return next(err) }
            res.redirect('/admin/clients');
        })
    }
]

exports.clients_delete = function (req, res, next) {
    Client.findByIdAndRemove(req.params.id)
        .exec(function (err, result) {
            if (err) { return next(err); }
            res.redirect('/admin/clients');
        })
};
exports.clients_approve = function (req, res, next) {
    Client.findById(req.params.id)
        .exec(function (err, result) {
            if (err) { return next(err); }
            result.status = "Подтвержден";
            result.save(function (err,saved) {
                if (err) { return next(err); }
                res.redirect('/admin/clients');
            });
        });
}

exports.week_get = function (req, res, next) {
    var title = req.params.num == 1 ? "Текущая неделя" : "Следующая неделя";
    //Текущие даты и время
    moment.locale('ru');
    var Dates = [];
    for (var day = 0; day < 7; day++) {
        Dates.push(moment().add(day, 'd').add(req.params.num - 1, 'w').format('ddd DD.MM.YY'));
    }
    var time_select = [];
    var first = moment().set({ 'hour': 6, 'minute': 0 });
    for (var i = 0; i < 71; i++) {
        time_select.push(first.add(15, 'm').format("HH:mm"));
    }
    //-------------------

    async.parallel({
        activities: function (callback) {
            Activity.find({ date: { $in: Dates } })
                .populate('instructor members')
                .exec(callback)
        },
        instructor_list: function (callback) {
            Instructor.find({})
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('adminWeek', {
            title: title,
            user: req.session.userId,
            dates: Dates,
            time_select: time_select,
            activities: results.activities,
            instructor_list: results.instructor_list
        });
    });
}

exports.activity_save_post = [
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {
        var ActivityData = {
            date: req.body.trainingdate,
            time: req.body.trainingtime,
            timeStart: req.body.timestart,
            timeEnd: req.body.timeend,
            activity: req.body.activity,
            vacancy: Number(req.body.vacancy),
        }
        console.log(req.body);
        async.parallel({
            instructor: function (callback) {
                Instructor.findOne({ name: req.body.instructor }).exec(callback)
            },
            activity: function (callback) {
                Activity.findOne({
                    date: req.body.trainingdate,
                    time: req.body.trainingtime
                }).exec(callback)
            }
        }, function (err, result) {
            console.log(result)
            if (err) { return next(err); }
            if (result.instructor != null) {
                ActivityData.instructor = result.instructor._id;
            }
            if (result.activity != null) {
                result.activity.set(ActivityData);
                result.activity.save(function (err, ActivityData) {
                    if (err) { return next(err) }
                    res.json({ success: true });
                })
            }
            else {
                Activity.create(ActivityData, function (err, result) {
                    if (err) { return next(err); }
                    res.json({ success: true });
                })
            }
        })
    }
];

exports.activity_delete_post = function (req, res, next) {
    Activity.findOneAndRemove({
        date: req.body.trainingdate,
        time: req.body.trainingtime
    }, function (err, result) {
        if (err) { return next(err); }
        res.json({ success: true })
    });
}

exports.activity_member_list_post = function (req, res, next) {
    Activity.findOne({
        date: req.body.trainingdate,
        time: req.body.trainingtime
    })
        .populate('members')
        .exec(function (err, result) {
            console.log(result);
            if (err) { return next(err); }
            if(result == null) {
                res.json({ members: [] });
                return next();
            }
            if (result.members == null)
                res.json({ members: [] });
            else
                res.json({ members: result.members });
        })
};

exports.activity_member_list_delete_post = function (req, res, next) {
    Activity.findOne({
        date: req.body.trainingdate,
        time: req.body.trainingtime
    })
        .populate('members')
        .exec(function (err, result) {
            console.log(result);
            if (err) { return next(err); }
            var found = result.members.find(function (element, ind) {
                return element.name == req.body.memberName;
            });
            var inx = result.members.indexOf(found);
            result.members.splice(inx, 1);
            result.save(function (err, ActivityData) {
                if (err) { return next(err) }
                res.json({ success: true });
            });
        });
};