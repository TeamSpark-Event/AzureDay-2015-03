var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        page:
        {
        },
        partials: {
            header: 'layout/header',
            footer: 'layout/footer',
            layout: "layout/base"
        }});
});

router.get('/agenda', function(req, res) {
    res.render('agenda', {
        partials: {
            layout: "layout/base"
        }});
});

router.get('/registration', function(req, res) {
    res.render('registration', {
        partials: {
            layout: "layout/base"
        }});
});

router.get('/speakers', function(req, res) {
    res.render('speakers', {
        partials: {
            layout: "layout/base"
        }});
});

router.get('/locations', function(req, res) {
    res.render('locations', {
        partials: {
            layout: "layout/base"
        }});
});

router.get('/live', function(req, res) {
    res.render('live', {
        partials: {
            layout: "layout/base"
        }});
});

module.exports = router;
