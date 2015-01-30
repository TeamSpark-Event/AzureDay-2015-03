var path = require('path');

var minify = require('html-minifier').minify;

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

function getMinifiedHtml(html){
    return minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
    });
}

router.get('/', function(req, res) {
    dataStorage.getEntities('AzureDayPartners', '2015-03').then(function(result) {
        res.render('index', {
            partners: result,
            page: {
            },
            partials: getPartials()
        }, function(err, html) {
            res.send(getMinifiedHtml(html));
        });
    });
});

router.get('/agenda', function(req, res) {
    dataStorage.getEntities('AzureDayAgenda', '2015-03').then(function(result) {
        res.render('agenda', {
            agenda: result,
            partials: getPartials()
        }, function(err, html) {
            res.send(getMinifiedHtml(html));
        });
    });
});

router.get('/registration', function(req, res) {
    res.render('registration', {
        partials: getPartials()
    }, function(err, html) {
        res.send(getMinifiedHtml(html));
    });
});

router.get('/speakers', function(req, res) {
    dataStorage.getEntities('AzureDaySpeakers', '2015-03').then(function(result) {
        res.render('speakers', {
            speakers: result,
            partials: getPartials()
        }, function(err, html) {
            res.send(getMinifiedHtml(html));
        });
    });
});

router.get('/locations', function(req, res) {
    res.render('locations', {
        partials: getPartials()
    }, function(err, html) {
        res.send(getMinifiedHtml(html));
    });
});

router.get('/live', function(req, res) {
    res.render('live', {
        partials: getPartials()
    }, function(err, html) {
        res.send(getMinifiedHtml(html));
    });
});

module.exports = router;
