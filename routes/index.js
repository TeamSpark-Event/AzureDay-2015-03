var path = require('path');
var uuid = require('uuid');

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
    dataStorage.getEntities('AzureDayMain', '2015-03').then(function(result) {
        var pages = result.filter(function(item) { return item.RowKey._ === 'Social' });
        pages = pages.length === 1 ? pages[0] : { };

        dataStorage.getEntities('AzureDayPartners', '2015-03').then(function(result) {
            var partners = result;

            res.render('index', {
                partners: partners,
                pages: pages,
                partials: getPartials()
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
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

    var entity = {
        PartitionKey: { '_' : '2015-03' },
        RowKey: { '_' : req.body.tbEmail },
        FullName: { '_' : req.body.tbName },
        Location: { '_' : req.body.ddlLocation }
    };

    dataStorage.insertEntity('AzureDayRegistration', entity).then(function(result){
        if (result.isError) {
            var errorMessage = result.errorMessage || 'Простите, произошла ошибка. Пожалуйста, попробуйте пройти регистрацию повторно.';

            dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
                res.render('registration', {
                    partials: getPartials(),
                    isShowRegistrationForm: true,
                    errorMessage: errorMessage,
                    locations: result
                }, function(err, html) {
                    res.send(getMinifiedHtml(html));
                });
            });
        } else {
            var entityFeedback = {
                PartitionKey: { '_' : '2015-03' },
                RowKey: { '_' : uuid.v4() },
                EMail: { '_' : req.body.tbEmail },
                FullName: { '_' : req.body.tbName },
                Location: { '_' : req.body.ddlLocation }
            };

            dataStorage.insertEntity('AzureDayFeedback', entityFeedback).then(function(){
                res.render('registration', {
                    partials: getPartials(),
                    isShowRegistrationForm: false
                }, function(err, html) {
                    res.send(getMinifiedHtml(html));
                });
            });
        }
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
    dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
        res.render('locations', {
            partials: getPartials(),
            locations: result
        }, function(err, html) {
            res.send(getMinifiedHtml(html));
        });
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
