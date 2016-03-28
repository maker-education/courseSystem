angular.module('MetronicApp').controller('LoginController', ['$rootScope', '$scope', '$location', '$window',
 '$http', 'UserService', 'Base64', function LoginController($rootScope, $scope, $location, $window, $http, UserService, Base64) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.login = true;

    $scope.signIn = function signIn(username, password) {
        if (username != null && password != null) {
            UserService.signIn(username, password).success(function(data) {
                $window.sessionStorage.token = data.token;
                var token = Base64.encode(data.token + ':unused');
                $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
                $rootScope.settings.layout.login = false;
                $location.path("/dashboard");
            }).error(function(status, data) {
                alert("用户名或密码错误")
                console.log(status);
                console.log(data);
            });
        }
    };
}
]);

