var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//функция проверки авторизации
function checkSignIn(req, res, next) {
    if (req.session.userId) {
        next();     //If session exists, proceed to page
    } else {
        res.redirect('/admin/login');
        //Error, trying to access unauthorized page
    }
}

/* GET admin page. */
router.get('/', checkSignIn, function (req, res, next) {
    res.redirect('/admin/week/1');
});

router.get('/week/search', adminController.search_member);
router.get('/week/:num', checkSignIn, adminController.week_get);


router.get('/clients', checkSignIn, adminController.clients_get);
router.post('/clients', checkSignIn, adminController.clients_add_post);
router.get('/clients/delete/:id', checkSignIn, adminController.clients_delete);
router.get('/clients/approve/:id', checkSignIn, adminController.clients_approve);

router.get('/instructors', checkSignIn, adminController.instructors_get);
router.post('/instructors', checkSignIn, adminController.instructors_add_post);
router.get('/instructors/delete/:id', checkSignIn, adminController.instructors_delete);


router.get('/login', adminController.auth_get);
router.post('/login', adminController.auth_post);

router.get('/etaerc', adminController.admin_create_get);
router.post('/etaerc', adminController.admin_create_post);

router.post('/activity/save', jsonParser, adminController.activity_save_post);
router.post('/activity/delete', jsonParser, adminController.activity_delete_post);
router.post('/activity/member_list', jsonParser, adminController.activity_member_list_post);
router.post('/activity/member_list_delete',jsonParser,adminController.activity_member_list_delete_post);
module.exports = router;
