angular.module('MetronicApp').controller('LoginController', ['$rootScope', '$scope', '$location', '$window',
 '$http', 'UserService', 'Base64', function LoginController($rootScope, $scope, $location, $window, $http, UserService, Base64) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.login = true;
    delete $window.sessionStorage.token;

    $scope.signIn = function signIn(username, password) {
        if (username != null && password != null) {
            UserService.signIn(username, password).success(function(data) {
                if (data.token) {
                    var token = Base64.encode(data.token + ':unused');
                    $window.sessionStorage.token = token;
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
                    $rootScope.settings.layout.login = false;
                    $location.path("/dashboard");
                }else {
                    alert("用户名或密码错误")
                }
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }
    };
}
]);

