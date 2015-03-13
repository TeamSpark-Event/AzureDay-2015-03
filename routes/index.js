var path = require('path');
var uuid = require('uuid');

var minify = require('html-minifier').minify;

var express = require('express');
var router = express.Router();

var nodePromise = require("node-promise");

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
    nodePromise.all([
        dataStorage.getEntities('AzureDayMain', '2015-03'),
        dataStorage.getEntities('AzureDayPartners', '2015-03')
    ]).then(function(results) {
        var pages = results[0].filter(function(item) { return item.RowKey._ === 'Social' });
        pages = pages.length === 1 ? pages[0] : { };

        var partners = results[1];

        res.render('index', {
            partners: partners,
            pages: pages,
            partials: getPartials()
        }, function(err, html) {
            res.send(getMinifiedHtml(html));
        });
    });
});

router.get('/agenda', function(req, res) {
    nodePromise.all([
        dataStorage.getEntities('AzureDayAgenda', '2015-03'),
        dataStorage.getEntities('AzureDayTopics', '2015-03')
    ]).then(function(results) {
        var agenda = results[0];

        var topics = results[1];

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

router.get('/registration', function(req, res) {
    res.render('registration-closed', {
        partials: getPartials()
    }, function(err, html) {
        res.send(getMinifiedHtml(html));
    });

    //dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
    //    res.render('registration-closed', {
    //        partials: getPartials(),
    //        locations: result,
    //        isShowRegistrationForm: true
    //    }, function(err, html) {
    //        res.send(getMinifiedHtml(html));
    //    });
    //});
});

router.post('/registration', function(req, res){
    res.render('registration-closed', {
        partials: getPartials()
    }, function(err, html) {
        res.send(getMinifiedHtml(html));
    });

    //function isEmpty(val) {
    //    return typeof(val) === 'undefined'
    //        || val === null
    //        || val.length === 0;
    //}
    //
    //if (isEmpty(req.body.tbName) || isEmpty(req.body.tbEmail) || isEmpty(req.body.ddlLocation)) {
    //    dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
    //        res.render('registration', {
    //            partials: getPartials(),
    //            isShowRegistrationForm: true,
    //            errorMessage: 'Нужно заполнить все поля формы.',
    //            locations: result
    //        }, function(err, html) {
    //            res.send(getMinifiedHtml(html));
    //        });
    //    });
    //
    //    return;
    //}
    //
    //var entity = {
    //    PartitionKey: { '_' : '2015-03' },
    //    RowKey: { '_' : req.body.tbEmail },
    //    FullName: { '_' : req.body.tbName },
    //    Location: { '_' : req.body.ddlLocation }
    //};
    //
    //dataStorage.insertEntity('AzureDayRegistration', entity).then(function(result){
    //    if (result.isError) {
    //        var errorMessage = result.errorMessage || 'Простите, произошла ошибка. Пожалуйста, попробуйте пройти регистрацию повторно.';
    //
    //        dataStorage.getEntities('AzureDayLocations', '2015-03').then(function(result) {
    //            res.render('registration', {
    //                partials: getPartials(),
    //                isShowRegistrationForm: true,
    //                errorMessage: errorMessage,
    //                locations: result
    //            }, function(err, html) {
    //                res.send(getMinifiedHtml(html));
    //            });
    //        });
    //    } else {
    //        var entityFeedback = {
    //            PartitionKey: { '_' : '2015-03' },
    //            RowKey: { '_' : uuid.v4() },
    //            EMail: { '_' : req.body.tbEmail },
    //            FullName: { '_' : req.body.tbName },
    //            Location: { '_' : req.body.ddlLocation }
    //        };
    //
    //        dataStorage.insertEntity('AzureDayFeedback', entityFeedback).then(function(){
    //            res.render('registration', {
    //                partials: getPartials(),
    //                isShowRegistrationForm: false
    //            }, function(err, html) {
    //                res.send(getMinifiedHtml(html));
    //            });
    //        });
    //    }
    //});
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

router.get('/live-test', function(req, res) {
    res.render('live-test', {
        partials: getPartials()
    }, function(err, html) {
        res.send(getMinifiedHtml(html));
    });
});

router.get('/feedback/:id', function(req, res) {
    var id = req.params.id;

    dataStorage.getEntities('AzureDayFeedback', '2015-03', id).then(function(result){
        if (result.length === 0) {
            res.render('feedback', {
                partials: getPartials(),
                isShowFeedbackForm: false,
                errorMessage: "Вы зашли по неверной ссылке."
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });

            return;
        }

        nodePromise.all([
            dataStorage.getEntities('AzureDayTopics', '2015-03')
        ]).then(function(results) {
            var topics = results[0];

            for(var i = 0; i < topics.length; i++) {
                topics[i].index = i;
            }

            res.render('feedback', {
                partials: getPartials(),
                isShowFeedbackForm: true,
                errorMessage: null,
                topics: topics,
                id: id
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
        });
    });
});

router.post('/feedback', function(req, res) {
    var entity = {
        PartitionKey: { '_' : '2015-03' },
        RowKey: { '_' : req.body["hidId"] }
    };

    for (var i = 0; i < 10; i++) {
        entity["speaker" + i] = { '_' : req.body["speaker" + i] };
    }

    entity["subscribeMe"] = { '_' : req.body["ddlMailList"] };

    entity["location"] = { '_' : req.body["location"] };
    entity["video"] = { '_' : req.body["video"] };

    entity["adv"] = { '_' : req.body["ddlSource"] };
    entity["comments"] = { '_' : req.body["tbComments"] };

    dataStorage.mergeEntity('AzureDayFeedback', entity).then(function(result){
        if (result.isError) {
            res.render('feedback', {
                partials: getPartials(),
                isShowFeedbackForm: false,
                errorMessage: result.errorMessage
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
        } else {
            res.render('feedback', {
                partials: getPartials(),
                isShowFeedbackForm: false,
                errorMessage: null
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
        }
    });
});

router.get('/attendees/:id', function(req, res) {
    var id = req.params.id;

    dataStorage.getEntities('AzureDayLocations', '2015-03', null, { UID : id }).then(function(result) {
        if (result.length === 0) {
            res.render('attendees', {
                partials: getPartials(),
                locationName: '',
                attendeesCount: 0,
                attendees: []
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
            return;
        }

        var locationKey = result[0].RowKey._ + ' ' + result[0].Address._;
        if (typeof(result[0].Title) !== 'undefined') {
            locationKey += ' (' + result[0].Title._ + ')';
        }

        dataStorage.getEntities('AzureDayRegistration', '2015-03', null, { Location : locationKey }).then(function(result) {
            result.map(function(attendee){
                var emailArr = attendee.RowKey._.split('@');

                var len;

                switch(emailArr[0].length) {
                    case 0:
                    case 1:
                        len = 0;
                        break;
                    case 2:
                        len = 1;
                        break;
                    case 3:
                    case 4:
                        len = 2;
                        break;
                    case 5:
                        len = 3;
                        break;
                    default:
                        len = 4;
                        break;
                }

                attendee.RowKey._ = emailArr[0].substr(0, len).toLowerCase() + new Array(emailArr[0].length - len + 1).join("*") + "@" + emailArr[1];
                attendee.FullName._ = attendee.FullName._.replace(/^[a-zа-я]/, function(m){ return m.toUpperCase() });
            });

            result = result.sort(function(a, b) {
                if (a.FullName._ < b.FullName._) {
                    return -1;
                }
                if (a.FullName._ > b.FullName._) {
                    return 1;
                }
                return 0;
            });

            res.render('attendees', {
                partials: getPartials(),
                locationName: locationKey,
                attendeesCount: result.length,
                attendees: result
            }, function(err, html) {
                res.send(getMinifiedHtml(html));
            });
        })
    });
});

module.exports = router;
