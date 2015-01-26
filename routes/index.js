var path = require('path');

var express = require('express');
var router = express.Router();

var dataStorage = require(path.join(__dirname, '../services/DataStorage'));

function getPartials() {
    return {
        header: 'layout/header',
        footer: 'layout/footer',
        layout: "layout/base"
    };
}

router.get('/', function(req, res) {
    res.render('index', {
        page:
        {
        },
        partials: getPartials()
    });
});

router.get('/agenda', function(req, res) {
    dataStorage.getEntities('AzureDayAgenda', '2015-03').then(function(result) {
        res.render('agenda', {
            agenda: result,
            partials: getPartials()
        });
    });
});

router.get('/registration', function(req, res) {
    res.render('registration', {
        partials: getPartials()});
});

router.get('/speakers', function(req, res) {
    dataStorage.getEntities('AzureDaySpeakers', '2015-03').then(function(result) {
        res.render('speakers', {
            speakers: result,
            partials: getPartials()
        });
    });
});

router.get('/locations', function(req, res) {
    res.render('locations', {
        partials: getPartials()
    });
});

router.get('/live', function(req, res) {
    res.render('live', {
        partials: getPartials()
    });
});

module.exports = router;
