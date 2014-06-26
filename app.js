/* globals */

var pages = [];

(function() {
    var gps = angular.module('googlePageSpeed', []);

    gps.controller('DashboardController', function ($scope, $http) {
        $scope.pages = pages;
        $scope.getResults = function() {
            $http({method: 'GET', url: '/results.json'}).success(function (data, status) {
                $scope.pages = data;
            }).error(function(data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        };
        $scope.getResults();
    });

    gps.controller('TestingController', function ($scope, $http) {
        $scope.runTests = function() {
            $scope.status = 'Testing...';
            $http({method: 'GET', url: '/test'}).success(function (data, status) {
                $scope.status = false;
                angular.element(document.getElementById('dashboard')).scope().getResults();
            }).error(function(data, status) {
                $scope.status = status;
            });
        };
    });
}());