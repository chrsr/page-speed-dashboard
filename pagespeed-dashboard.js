/* globals require, console */

var googleapis = require('googleapis');
var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname));
var API_KEY = 'AIzaSyBkrQ6gZuncKT0jRXkNr9DqvVATsqBAnZM';
var results = [];

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/test', function (req, res) {
    fs.readFile(__dirname + '/pages.json', 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        results = JSON.parse(data);
        googleapis.discover('pagespeedonline', 'v1').execute(function (err, psclient) {
            var request, params = {}, i, testIndex = 0;
            for (i = 0; i < results.length; i += 1) {
                params.url = results[i].url;
                request = psclient.pagespeedonline.pagespeedapi.runpagespeed(params).withApiKey(API_KEY);
                request.execute(function (err, result) {
                    console.log(result.score);
                    results[testIndex].score = result.score;
                    results[testIndex].status = (result.score > 80) ? 'ok' : 'bad';
                    testIndex += 1;
                    if (testIndex == results.length) {
                        res.send('Testing complete');
                    }
                });
            }
        });
    });
});

app.get('/pages.json', function (req, res) {
    res.sendFile('pages.json');
});

app.get('/results.json', function (req, res) {
    res.json(results);
});

app.listen(3000);