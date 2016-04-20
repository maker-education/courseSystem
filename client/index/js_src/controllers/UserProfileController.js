angular.module('MetronicApp').controller('UserProfileController',
['$rootScope', '$scope', '$window', '$http', '$timeout', 'MainService', 'DBObject', 'FileUploader', 'fileReader', 'settings',
    function($rootScope, $scope, $window, $http, $timeout, MainService, DBObject, FileUploader, fileReader, settings) {
        /*$scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
            //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
        });*/
        // set sidebar closed and body solid layout mode
        //$rootScope.settings.layout.pageBodySolid = true;
        //$rootScope.settings.layout.pageSidebarClosed = true;


        // get current user info
        MainService.httpgetSystemUser()
        .success(function (data) {
            $scope.user = data;
        })
        .error(handlError);

        $scope.changePasswd = function(old, newpd, user) {
            if (! old ) {
                alert("请输入原密码");
                return;
            }
            MainService.postSystemData(options.api.userinfo + '/cpd', {'passwd':old})
            .success(function (data) {
                if (data.success) {
                    if (!newpd || newpd != user.password) {
                        alert("密码为空或两次输入密码不一致");
                        return;
                    }
                    delete user.role_names
                    DBObject.update({object: 'user', user_id: user.id}, user,
                    (function (data) {
                        alert("修改成功");
                    }),
                    handlError);
                } else if (data.error_info){
                    alert(data.error_info);
                } else {
                    alert("错误!");
                }
            })
            .error(handlError);
        };

        $scope.changAvatar = function () {
            $('#change_avatar').modal('toggle');
            file_input_div.find('input[type="file"]').val("");
            $scope.imageSrc = '';
            $scope.uploader.clearQueue();
            $scope.item = null;
        }

        var file_input_div = $('[data-provides="fileinput"]');

        var uploader = $scope.uploader = new FileUploader(
            {
                url: options.api.base_url + options.api.userinfo + "/avatar",
                headers: {
                    Authorization : 'Basic ' + $window.sessionStorage.token
                },
                queueLimit: 3,
            }
        );

        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            while($scope.uploader.queue.length > 1) $scope.uploader.queue[0].remove();
            $scope.item = $scope.uploader.queue[0];
        };

        $scope.getFileChangeImg = function (file) {
            console.log('getFile() called.');

            if (file) fileReader.readAsDataUrl(file, $scope).then(function (result) {
                console.log('readAsDataUrl: result.length === ', result.length);
                $scope.imageSrc = result;
            });
        };

        $scope.saveAvatar = function(user, item) {
            item.upload();
            alert("保存成功");
            $window.location.reload();
        }

        $scope.file = {};

    }
]); 
