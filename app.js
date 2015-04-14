/* globals angular */

(function () {
    var gps = angular.module('googlePageSpeed', []),
        googleKey = 'YOURKEYHERE';

    gps.controller('MainController', ['$scope', '$http', function ($scope, $http) {
        $scope.pages = [
            {
                "name": "wotif home",
                "url": "http://www.wotif.com/?experiments=oldhome"
            },
            {
                "name": "wotif home on mobile",
                "url": "http://www.wotif.com",
                "isMobile": "true"
            },
            {
                "name": "wotif booking form",
                "url": "https://securepayment.wotif.com/hotel/booking/W4937/127451?firstDate={{date}}",
                "date": {
                    "format": "YYYY-MM-DD" // i.e. 2014-08-26
                }
            }
        ];
        // $http({method: 'GET', url: 'pages.json'}).then(function (data) {
        //     $scope.pages = data;
        // });
        $scope.results = [];
        $scope.loading = true;
    }]);

    gps.controller('DashboardController', ['$scope', '$filter', '$http', '$q', function ($scope, $filter, $http, $q) {
        var googleAPIurl = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed';
        var promises = [];
        var results = [];
        var ordering = $filter('orderBy');

        angular.forEach($scope.pages, function (it, key) {
            var url = googleAPIurl + '?url=' + it.url.replace(/&/g, '%26') + '&key=' + googleKey;
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