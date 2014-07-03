var casper = require('casper').create();
var fs = require('fs');

urls = JSON.parse(fs.read('pages.json'));
validatedUrls = [];
var i = -1;

casper.start('http://www.wotif.com');

casper.then(function () {
    this.each(urls, function () { 
        i += 1;
        this.thenOpen((urls[i].url), function () {
            this.echo(this.getCurrentUrl());
            this.capture('screenshots/' + urls[i].name + new Date().getTime() + '.png', {
                top: 0,
                left: 0,
                width: 1024,
                height: 768
            });
        });
        if (urls[i].thenClick) {
            this.thenClick(urls[i].thenClick, function() {
                this.echo(this.getCurrentUrl());
                this.capture('screenshots/' + urls[i].name + new Date().getTime() + '.png', {
                    top: 0,
                    left: 0
                });
            });
        }
    });
});

casper.run();