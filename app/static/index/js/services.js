appServices.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
    }

    return auth;
});

appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }

            return $q.reject(rejection);
        }
    };
});

appServices.factory('UserService', function ($http) {
    return {
        signIn: function(username, password) {
            return $http.get(options.api.base_url + '/user/signin', {username: username, password: password});
        },

        logOut: function() {
            return $http.get(options.api.base_url + '/user/logout');
        },

        /*
        register: function(username, password, passwordConfirmation) {
            return $http.post(options.api.base_url + '/user/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
        }*/
    }
});
