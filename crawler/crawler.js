var casper = require('casper').create();
var fs = require('fs');

urls = JSON.parse(fs.read('../pages.json'));
var i = -1;

var dimentions = {
    width: 1280,
    height: 1024
};

casper.start();

// casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
casper.viewport(dimentions.width, dimentions.height);

casper.then(function () {
    this.each(urls, function () { 
        i += 1;
        this.thenOpen((urls[i].url), function () {
            this.echo(this.getCurrentUrl());
            this.capture('screenshots/' + this.getTitle() + new Date().getTime() + '.png', {
                top: 0,
                left: 0,
                width: dimentions.width,
                height: dimentions.height
            });
        });
        if (urls[i].thenClick) {
            this.thenClick(urls[i].thenClick, function() {
                this.echo(this.getCurrentUrl());
                this.capture('screenshots/' + this.getTitle() + new Date().getTime() + '.png', {
                    top: 0,
                    left: 0,
                    width: dimentions.width,
                    height: dimentions.height
                });
            });
        }
    });
});

casper.run();