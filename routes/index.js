var path = require('path');

var express = require('express');
var router = express.Router();

var dataStorage = require(path.join(__dirname, '../services/DataStorage'));

router.get('/', function(req, res) {
    res.render('index', {
        partials: {
            layout: "layout/base"
        }});
});

router.get('/agenda', function(req, res) {
    dataStorage.getEntities('AzureDayAgenda', '2015-03').then(function(result) {
        res.render('agenda', {
            agenda: result,
            partials: {
                layout: "layout/base"
            }});
    });
});

router.get('/registration', function(req, res) {
    res.render('registration', {
        partials: {
            layout: "layout/base"
        }});
});

router.get('/speakers', function(req, res) {
    dataStorage.getEntities('AzureDaySpeakers', '2015-03').then(function(result) {
        res.render('speakers', {
            speakers: result,
            partials: {
                layout: "layout/base"
            }
        });
    });
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
