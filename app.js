/* globals angular */

var pages = [
    {
        name: "wotif homepage",
        url: "http://www.wotif.com"
    },
    {
        name: "wotif homepage (responsive)",
        url: "http://www.wotif.com",
        isMobile: true
    },
    {
        name: "wotif search results (25)",
        url: "http://www.wotif.com/search/results?region=13851"
    },
    {
        name: "wotif hotel details",
        url: "http://www.wotif.com/hotel/View?hotel=W4937"
    },
    {
        name: "wotif packages homepage",
        url: "http://www.wotif.com/packages"
    },
    {
        name: "wotif packages lionking",
        url: "http://www.wotif.com/packages/lionking"
    },
    {
        name: "wotif packages lionking",
        url: "http://www.wotif.com/packages/wicked"
    },
    {
        name: "wotif flights homepage",
        url: "http://www.wotif.com/flights"
    },
    {
        name: "holiday rentals homepage",
        url: "http://www.wotif.com/holiday-rentals"
    }
];

(function () {
    var gps = angular.module('googlePageSpeed', []);

    gps.controller('MainController', ['$scope', function ($scope) {
        $scope.pages = pages;
        $scope.results = [];
        $scope.loading = true;
    }]);

    gps.controller('DashboardController', ['$scope', '$http', '$q', function ($scope, $http, $q) {
        var googleAPIurl = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed';
        var promises = [];
        var results = [];

        angular.forEach($scope.pages, function (it, key) {
            var url = googleAPIurl + '?url=' + it.url + '&key=AIzaSyBkrQ6gZuncKT0jRXkNr9DqvVATsqBAnZM';
            if (it.isMobile) {
                url += '&strategy=mobile';
            }
            promises.push($http({method: 'GET', url: url}).then(function (data) {
                var result = {
                    name: data.data.title,
                    score: data.data.score,
                    url: data.data.id,
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
            $scope.results = results;
        });

    }]);
}());