/* Setup general page controller */
angular.module('MetronicApp', ['ckeditor']).controller('PostArticleController',
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        /*
        $scope.froalaOptions = {
            toolbarButtons : //["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', '|',
   'color', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-',
   'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
            toolbarInline: false,
            placeholderText: '写下你的感悟',
            language: 'zh_cn',
            imageUploadURL: 'lib/imgupload.php',//上传到本地服务器
            imageUploadParams: {id: "edit"},
            imageDeleteURL: 'lib/delete_image.php',//删除图片
            imagesLoadURL: 'lib/load_images.php', //管理图片
        }*/

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

    }
]);
