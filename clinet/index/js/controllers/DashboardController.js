angular.module('MetronicApp').controller('DashboardController', ['$rootScope', '$scope', 'MainService',
    function($rootScope, $scope, MainService) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.dashboard = [];
        MainService.getSystemData('/dashboard').success(function(data){
            $scope.dashboard = data;
        }).error(handlError);
}]);
