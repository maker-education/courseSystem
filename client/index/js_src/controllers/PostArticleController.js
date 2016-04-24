/* Setup general page controller */
angular.module('MetronicApp', ['froala']).controller('PostArticleController',
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.froalaOptions = {
            toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
            toolbarInline: false,
            placeholderText: 'Enter Text Here',
            language: 'zh_cn',
            pluginsEnabled: ['image', 'link'],
            imageUploadURL: 'lib/imgupload.php',//上传到本地服务器
            imageUploadParams: {id: "edit"},
            imageDeleteURL: 'lib/delete_image.php',//删除图片
            imagesLoadURL: 'lib/load_images.php', //管理图片
        }

        //$('a[href="https://froala.com/wysiwyg-editor"]').parent.remove();
    }
]);
