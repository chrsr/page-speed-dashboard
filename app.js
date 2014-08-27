/* globals angular */

(function () {
    var gps = angular.module('googlePageSpeed', []),
        pages = [
            {
                "name": "wotif home",
                "url": "http://www.wotif.com/?experiments=oldhome"
            },
            {
                "name": "wotif home (responsive)",
                "url": "http://www.wotif.com?experiments=home"
            },
            {
                "name": "wotif home (mobile brower)",
                "url": "http://www.wotif.com?experiments=home",
                "isMobile": true
            },
            {
                "name": "wotif search results (25 hotels)",
                "url": "http://www.wotif.com/search/results?region=13851"
            },
            {
                "name": "wotif hotel details",
                "url": "http://www.wotif.com/hotel/View?hotel=W4937"
            },
            {
                "name": "wotif booking form",
                "url": "https://securepayment.wotif.com/hotel/booking/W4937/127451?firstDate={{date}}",
                "date": {
                    format: "YYYY-MM-DD" //2014-08-26
                }
            },
            {
                "name": "wotif packages home",
                "url": "http://www.wotif.com/packages"
            },
            {
                "name": "wotif packages lionking",
                "url": "http://www.wotif.com/packages/lionking"
            },
            {
                "name": "wotif packages wicked",
                "url": "http://www.wotif.com/packages/wicked"
            },
            {
                "name": "wotif packages details",
                "url": "http://www.wotif.com/packages/brisbane?pkgId=PKG0012&startDate=Fri+12+Dec+2014&endDate=Sun+14+Dec+2014&nights=2&adults=2&children=0&from=SYD",
                "date": {
                    format: "ddd+DD+MMM+YYYY" //Fri+12+Dec+2014
                }
            },
            {
                "name": "holiday rentals home",
                "url": "http://www.wotif.com/holiday-rentals"
            },
            {
                "name": "holiday rentals search",
                "url": "http://www.wotif.com/holiday-rentals/australia/brisbane"
            },
            {
                "name": "holiday rentals details",
                "url": "http://www.wotif.com/holiday-rentals/australia/brisbane/fern-street-cottage?src=W&source=Wotif&property_id=551670"
            },
            {
                "name": "flights home",
                "url": "http://www.wotif.com/flights"
            },
            {
                "name": "flights search",
                "url": "http://www.wotif.com/flights/search/any/1-0-0/SYD-BNE-{{date}}/",
                "date": {
                    format: "DD-MMM-YYYY" //01-Jan-2014
                }
            },
            {
                "name": "wotifia landing page",
                "url": "http://www.wotif.com/wotifia"
            }
        ];

    gps.controller('MainController', ['$scope', '$http', function ($scope, $http) {
        // $http({method: 'GET', url: 'pages.json'}).then(function (data) {
        //     $scope.pages = data;
        // });
        $scope.pages = pages;
        $scope.results = [];
        $scope.loading = true;
    }]);

    gps.controller('DashboardController', ['$scope', '$filter', '$http', '$q', function ($scope, $filter, $http, $q) {
        var googleAPIurl = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed';
        var promises = [];
        var results = [];
        var ordering = $filter('orderBy');

        angular.forEach($scope.pages, function (it, key) {
            var url = googleAPIurl + '?url=' + it.url.replace(/&/g, '%26') + '&key=AIzaSyBkrQ6gZuncKT0jRXkNr9DqvVATsqBAnZM';
            if (it.date) {
                url = url.replace(/{{date}}/, moment().add(2, 'days').format(it.date.format));
            }
            if (it.isMobile) {
                url += '&strategy=mobile';
            }
            promises.push($http({method: 'GET', url: url}).then(function (data) {
                var result = {
                    key: key,
                    name: it.name,
                    score: data.data.score,
                    url: data.data.id,
                    testUrl: 'https://developers.google.com/speed/pagespeed/insights/?url=' + data.data.id,
                    status: (data.data.score > 80) ? 'ok' : 'bad'
                };
                if (data.data.responseCode === 500) {
                    result.score = 'Error';
                    result.status = 'bad';
                }
                results.push(result);
            }));
        });

        $q.all(promises).then(function () {
            $scope.loading = false;
            $scope.results = ordering(results, '-key', true);
        });
    }]);
}());