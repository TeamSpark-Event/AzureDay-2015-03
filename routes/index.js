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
        var agenda = result;

        dataStorage.getEntities('AzureDayTopics', '2015-03').then(function(result) {
            var topics = result;

            var agendaTopics = [];

            for(var i = 0; i < agenda.length; i++) {
                var obj = {
                    agenda: agenda[i]
                };

                var topic = topics.filter(function(item) { return item.RowKey._ === agenda[i].RowKey._ });

                if (topic.length === 1) {
                    obj.topic = topic[0];
                }

                agendaTopics.push(obj);
            }

            res.render('agenda', {
                agendaTopics: agendaTopics,
                partials: getPartials()
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
        });
    });
});

router.get('/registration', function(req, res) {
    dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
        res.render('registration', {
            partials: getPartials(),
            locations: result,
            isShowRegistrationForm: true
        }, function(err, html) {
            res.send(getMinifiedHtml(html));
        });
    });
});

router.post('/registration', function(req, res){
    function isEmpty(val) {
        return typeof(val) === 'undefined'
            || val === null
            || val.length === 0;
    }

    if (isEmpty(req.body.tbName) || isEmpty(req.body.tbEmail) || isEmpty(req.body.ddlLocation)) {
        dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
            res.render('registration', {
                partials: getPartials(),
                isShowRegistrationForm: true,
                errorMessage: 'Нужно заполнить все поля формы.',
                locations: result
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
        });

        return;
    }

    res.render('registration', {
        partials: getPartials(),
        isShowRegistrationForm: false
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
