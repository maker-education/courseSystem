/* Setup general page controller */
angular.module('MetronicApp', ['ckeditor']).controller('PostArticleController',
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.options = {
            language: 'zh-cn',
            allowedContent: true,
            entities: false,
            height: 500,
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
                { name: 'editing',     groups: [ 'find', 'selection' ] },
                { name: 'forms' },
                { name: 'styles' },
                { name: 'colors' },
                '/',
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                { name: 'links' },
                { name: 'insert' },
                { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
           ],
        };

        $scope.content = {};

        $scope.save = function(c) {
            MainService.postSystemData(options.api.content + '/save', c)
            .success(function(data) {
                if (data.success) {
                    alert('保存成功');
                } else if (data.error_info){
                    alert(data.error_info);
                } else {
                    alert("错误!");
                }
            }).error(handlError);
        }

        var post_id = $location.search().id;

        if ( post_id ) {
            MainService.postSystemData( options.api.content + '/get/' + post_id, {})
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


    }
]);
