angular.module('MetronicApp').controller('LoginController', function($rootScope, $scope, $http, $timeout) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.login = true;
});
