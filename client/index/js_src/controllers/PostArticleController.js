/* Setup general page controller */
angular.module('MetronicApp', ['ckeditor']).controller('PostArticleController',
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        //Editor options.  
        $scope.options = {
            language: 'zh-cn',
            allowedContent: true,
            height: 400,
            extraPlugins: 'uploadimage,image2',
            entities: false,
            filebrowserImageUploadUrl: "aaa",
            toolbarGroups : [
                { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
                { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                { name: 'editing',     groups: [ 'find', 'selection'] },
                '/',
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                { name: 'links' , groups: ['Link','Unlink'] },
                { name: 'insert' },
                '/',
                { name: 'styles' },
                { name: 'colors' },
                { name: 'tools' },
                { name: 'others' },
            ]
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {
            // ...
        };
    }
]);
