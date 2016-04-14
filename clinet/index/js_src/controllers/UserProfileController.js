angular.module('MetronicApp').controller('UserProfileController',
['$rootScope', '$scope', '$http', '$timeout', 'MainService', 'DBObject', 'settings',
    function($rootScope, $scope, $http, $timeout, MainService, DBObject, settings) {
        /*$scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
            //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
        });*/

        // set sidebar closed and body solid layout mode
        //$rootScope.settings.layout.pageBodySolid = true;
        //$rootScope.settings.layout.pageSidebarClosed = true;

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


    }
]); 
