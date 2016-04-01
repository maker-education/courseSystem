/* Setup general page controller */
angular.module('MetronicApp').controller('AddTopicController', ['$rootScope', '$scope', '$window', '$location', 'settings',
    function($rootScope, $scope, $window, $location, settings) {
        $("#markdown-textarea").markdown(
            {
                autofocus:false,
                savable:false
            });
    }
]);
