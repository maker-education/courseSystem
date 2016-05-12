angular.module('MetronicApp', ['infinite-scroll']).controller('NewsController',
['$rootScope', '$scope', '$location', '$window', 'MainService', 'Reddit',
    function NewsController($rootScope, $scope, $location, $window, MainService, Reddit) {
    // set sidebar closed and body solid layout mode
        $scope.reddit = new Reddit();
    }
]).value('THROTTLE_MILLISECONDS', 500);


