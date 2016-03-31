/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController', ['$rootScope', '$scope', '$window', 'settings',
    function($rootScope, $scope, $window, settings) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
}]);