/* globals */

var pages = [
    {
        "name": "wotif homepage",
        "url": "http://www.wotif.com"
    },
    {
        "name": "wotif search results (25)",
        "url": "http://www.wotif.com/search/results?region=13851"
    },
    {
        "name": "wotif hotel details",
        "url": "http://www.wotif.com/hotel/View?hotel=W4937"
    },
    {
        "name": "wotif hotel booking",
        "url": "https://securepayment.wotif.com/booking/View?hotel=W4937&roomTypeId=W1895495&bookingAdapterTarget=W"
    },
    {
        "name": "wotif packages homepage",
        "url": "http://www.wotif.com/packages"
    },
    {
        "name": "wotif flights homepage",
        "url": "http://www.wotif.com/flights"
    }
];

(function() {
    var gps = angular.module('googlePageSpeed', []);

    gps.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

    gps.controller('MainController', ['$scope', function ($scope) {
        $scope.pages = pages;
        $scope.results = [];
    }]);

    gps.controller('DashboardController', ['$scope', '$http', '$q', function ($scope, $http, $q) {
        var googleAPIurl = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed';
        var promises = [];
        var results = [];

        angular.forEach($scope.pages, function (it, key) {
            var url = googleAPIurl + '?url=' + it.url + '&key=AIzaSyBkrQ6gZuncKT0jRXkNr9DqvVATsqBAnZM';
            promises.push($http({method:'GET', url: url}).then(function (data) {
                var result = {
                    name: data.data.id,
                    score: data.data.score,
                    url: data.data.id,
                    status: (data.data.score > 80) ? 'ok' : 'bad'
                };
                if (data.data.responseCode === 500) {
                    result.score = 'Error';
                    result.status = 'bad';
                }
                results.push(result);
                $scope.results = results;
            }));
        });

        $q.all(promises).then(function ($scope) {
            // all done
        });

    }]);
}());