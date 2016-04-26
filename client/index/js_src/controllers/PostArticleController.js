/* Setup general page controller */
angular.module('MetronicApp', ['ckeditor']).controller('PostArticleController',
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.options = {
            language: 'zh-cn',
            allowedContent: true,
            entities: false,
            height: 420,
            tabSpaces: 2,
            //imageUploadUrl : "actions/ckeditorUpload",
            extraPlugins : 'uploadimage,image2',
            filebrowserImageUploadUrl : options.api.base_url + options.api.content +
                '/fileupload?token=' + $window.sessionStorage.token,
            menu_groups : 'clipboard,' +
                          'form,' +
                          'tablecell,tablecellproperties,tablerow,tablecolumn,table,' +
                          'anchor,link,image,flash,' +
                          'checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div' ,
            //filebrowserImageUploadUrl : "aaa",
            image_previewText : "-",
            toolbarGroups : [
                { name: 'tools' },
                { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                //{ name: 'editing',     groups: [ 'find', 'selection' ] },
                { name: 'colors' },
                //{ name: 'forms' },
                //{ name: 'styles' },
                //'/',
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                //{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                { name: 'paragraph',   groups: [ 'list', 'blocks', 'bidi' ] },
                { name: 'links' },
                { name: 'insert' },
                { name: 'document'},
                ],
        };

        $scope.content = {};

        $scope.post_id = $location.search().id;

        if ( $scope.post_id && $scope.post_id != 0) {
            MainService.postSystemData( options.api.content + '/get/' + $scope.post_id, {})
            .success(function (data) {
                if (data.content) {
                    $scope.content = data.content;
                } else if (data.error_info){
                    alert(data.error_info);
                } else {
                    alert("错误!");
                }
            }) .error(handlError);
        }

        $scope.save = function(c) {
            action = '/save';
            if ($scope.post_id) action = action + '/' + $scope.post_id;
            MainService.postSystemData(options.api.content + action, c)
            .success(function(data) {
                if (data.success) {
                    $scope.post_id = data.id;
                    alert('保存成功');
                } else if (data.error_info){
                    alert(data.error_info);
                } else {
                    alert("错误!");
                }
            }).error(handlError);
        }



    }
]);
