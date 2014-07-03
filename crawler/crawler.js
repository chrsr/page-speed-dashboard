var page = require('webpage').create();
var fs = require('fs');

var crawler = (function (page) {
    var iteration = 0;
    var urls;

    function openUrl(status) {
        console.log('OPENED: ', urls[iteration].url, ' STATUS: ', status);
        if (status !== 'success') {
            return;
        }

        // page actions
        if (!urls[iteration].completed && urls[iteration].button) {
            page.injectJs('../bower_components/jquery/dist/jquery.js');
            page.evaluate(function (button) {
                jQuery(button).click();
            }, urls[iteration].button);
            urls[iteration].completed = true;
        }

        screenshot = 'screenshots/' + urls[iteration].name + new Date().getTime() + '.jpg';
        page.render(screenshot, { format: "jpg" });

        iteration += 1;
        if (iteration < urls.length) {
            page.open(urls[iteration].url, null);
        }
    }

    return {
        crawl: function () {
            page.onLoadFinished = function (status) {
                console.log('another');
                openUrl(status);
            };
            urls = JSON.parse(fs.read('pages.json'));
            if (urls) {
                page.open(urls[0].url, null);
            }
        }
    };
}(page));

crawler.crawl();