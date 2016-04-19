/***
Metronic AngularJS App Main Script
***/

var handlError = function(status, data) {
    console.log(status);
    console.log(data);
};

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngResource"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', '$window', '$location',
    function($rootScope, $window, $location) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: '../assets',
            globalPath: '../assets/global',
            layoutPath: '../assets/layouts/layout4',
        };

        $rootScope.settings = settings;

        $.ajaxSetup({
            global: true,
            beforeSend:
                function(request) {
                    request.setRequestHeader("Authorization", 'Basic ' + $window.sessionStorage.token);
                },
            error:
                function(xhr, status, e) {
                    console.log(status);
                    $location.path('/login');
                }
        });
        return settings;
    }
]);

MetronicApp.factory('TokenInterceptor', function ($q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Basic ' + $window.sessionStorage.token;
            } else {
                $location.path('/login');
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response.data && response.data.error) {
                console.log(response.data.error);
                $location.path('/login');
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null &&
                (rejection.status === 401 || rejection.status === 404)
               ) {
                   delete $window.sessionStorage.token;
                   $location.path("/login");
               }

            return $q.reject(rejection);
        }
    };
});

MetronicApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

MetronicApp.factory('MainService', function ($http) {
    return {
        getSystemData: function(url) {
            return $http({
                method: 'post',
                url: options.api.base_url + options.api.system + url,
            });
        },

        postSystemData: function(url, post) {
            return $http.post(options.api.base_url + url,  post );
        },

        httpgetSystemData: function(url) {
            var turl = options.api.base_url + options.api.topics + '/static/' + url + '?d=1';
            return $http({
                method: 'GET',
                url: turl,
                responseType:'blob'
            });
        },

        httpgetSystemUser: function() {
            var turl = options.api.base_url + options.api.userinfo;
            return $http({
                method: 'GET',
                url: turl,
            });
        }
    }
})

MetronicApp.factory('DBObject', function ($resource, $http) {
    return  $resource( options.api.base_url + '/:object/:user_id', {}, {
        show: { method: 'GET', params: { object: '@o', user_id: '@id',  } },
        update: { method: 'PUT', params: { object: '@o', user_id: '@id',  } },
        delete: { method: 'DELETE', params: { object: '@o', user_id: '@id', } },
        query: { method: 'GET', isArray: true },
        create: { method: 'POST', params: { object: '@o', user_id: '@id', } }
    })
})

MetronicApp.factory("fileReader", function ($q) {
    var onLoad = function (reader, deferred, Sscope) {
      return function () {
        Sscope.$apply(function () {
          deferred.resolve(reader.result);
        });
      };
    };
    var onError = function (reader, deferred, Sscope) {
      return function () {
        Sscope.$apply(function () {
          deferred.reject(reader.result);
        });
      };
    };
    var onProgress = function (reader, Sscope) {
      return function (event) {
        Sscope.$broadcast(
          "fileProgress"
        , { total: event.total
          , loaded: event.loaded
          }
        );
      };
    };
    var getReader = function (deferred, Sscope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, Sscope);
      reader.onerror = onError(reader, deferred, Sscope);
      reader.onprogress = onProgress(reader, Sscope);
      return reader;
    };
    var readAsDataURL = function (file, Sscope) {
      var deferred = $q.defer();
      var reader = getReader(deferred, Sscope);
      reader.readAsDataURL(file);
      return deferred.promise;
    };
    return { readAsDataUrl: readAsDataURL };
  });


/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope','$location',
    function($scope, $rootScope, $location) {
        $scope.$on('$viewContentLoaded', function() {
            App.initComponents(); // init core components
            //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        });
        $scope.goPath = function goPath(path) {
            $location.path(path);
        };
    }
]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$location', '$window', 'MainService',
    function($scope, $location, $window, MainService) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initHeader(); // init header
        });

        $scope.logOut = function logOut() {
            delete $window.sessionStorage.token;
            $location.path('/login');
        };

        $scope.header = [];
        MainService.getSystemData('/header')
        .success(function(data){
            $scope.header = data;
        }).error(handlError);

}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', 'MainService',
    function($scope, MainService) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initSidebar(); // init sidebar
        });

        $scope.siderbarmenus= [];
        MainService.getSystemData('/sidebarmenu').success(function(data){
            $scope.siderbarmenus = data.data;
        }).error(handlError);
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
    // Login
    .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        data: {pageTitle: '登录'},
        controller: "LoginController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: '登录',
                    files: [
                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        '../assets/global/plugins/jquery.serializejson.min.js',
                        '../assets/pages/css/login-3.min.css',
                        'js/controllers/LoginController.min.js',
                        'js/services/LoginService.min.js',
                    ]
                });
            }]
        }
    })

    // Dashboard
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard.html",            
        data: {pageTitle: '总览'},
        //controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        '../assets/global/plugins/morris/morris.css',
                        '../assets/global/plugins/morris/morris.min.js',
                        '../assets/global/plugins/morris/raphael-min.js',
                        '../assets/global/plugins/jquery.sparkline.min.js',
                        '../assets/pages/scripts/dashboard.min.js',
                        'js/controllers/DashboardController.min.js',
                    ] 
                });
            }]
        }
    })

    .state('add_topic', {
        url: "/add_topic",
        templateUrl: "views/add_topic.html",            
        data: {pageTitle: '添加知识点'},
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    },
                    {
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
                            '../assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',
                            '../assets/global/plugins/filesaver/FileSaver.min.js',
                            '../assets/global/plugins/utf8/utf8.min.js',
                            'js/controllers/AddTopicController.min.js'
                        ]
                    }]);
            }]
        }
    })


    // topics
    .state('topics', {
        url: "/topics",
        templateUrl: "views/topics.html",
        data: {pageTitle: '知识点'},
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/datatables/datatables.min.css', 
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '../assets/global/plugins/datatables/datatables.all.min.js',
                        'js/controllers/TopicController.min.js'
                    ]
                });
            }]
        }
    })

    .state('users', {
        url: "/users",
        templateUrl: "views/users.html",
        data: {pageTitle: '用户'},
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/datatables/datatables.min.css', 
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        '../assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
                        '../assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',

                        'js/controllers/UsersController.min.js'
                    ]
                });
            }]
        }
    })


    // User Profile
    .state("profile", {
        url: "/profile",
        templateUrl: "views/profile/main.html",
        data: {pageTitle: '个人中心'},
        //controller: "UserProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    },
                    {
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/pages/css/profile.min.css',

                            '../assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
                            '../assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',

                            '../assets/global/plugins/jquery.sparkline.min.js',

                            'js/services/profile-pic.min.js',
                            'js/controllers/UserProfileController.min.js'
                        ]
                    }]);
            }]
        }
    })

    // User Profile Account
    .state("profile.account", {
        url: "/account",
        templateUrl: "views/profile/account.html",
        data: {pageTitle: '个人设置'}
    })




    /*
    // AngularJS plugins
    .state('fileupload', {
        url: "/file_upload.html",
        templateUrl: "views/file_upload.html",
        data: {pageTitle: 'AngularJS File Upload'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'angularFileUpload',
                    files: [
                        '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                    ] 
                }, {
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/GeneralPageController.min.js'
                    ]
                }]);
            }]
        }
    })

    // UI Select
    .state('uiselect', {
        url: "/ui_select.html",
        templateUrl: "views/ui_select.html",
        data: {pageTitle: 'AngularJS Ui Select'},
        controller: "UISelectController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'ui.select',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                    ] 
                }, {
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/UISelectController.js'
                    ] 
                }]);
            }]
        }
    })

    // UI Bootstrap
    .state('uibootstrap', {
        url: "/ui_bootstrap.html",
        templateUrl: "views/ui_bootstrap.html",
        data: {pageTitle: 'AngularJS UI Bootstrap'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/GeneralPageController.js'
                    ] 
                }]);
            }] 
        }
    })

    // Tree View
    .state('tree', {
        url: "/tree",
        templateUrl: "views/tree.html",
        data: {pageTitle: 'jQuery Tree View'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                        '../assets/global/plugins/jstree/dist/jstree.min.js',
                        '../assets/pages/scripts/ui-tree.min.js',
                        'js/controllers/GeneralPageController.js'
                    ] 
                }]);
            }] 
        }
    })

    // Form Tools
    .state('formtools', {
        url: "/form-tools",
        templateUrl: "views/form_tools.html",
        data: {pageTitle: 'Form Tools'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                        '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                        '../assets/global/plugins/typeahead/typeahead.css',

                        '../assets/global/plugins/fuelux/js/spinner.min.js',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                        '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                        '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                        '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                        '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                        '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                        '../assets/global/plugins/typeahead/handlebars.min.js',
                        '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                        '../assets/pages/scripts/components-form-tools-2.min.js',

                        'js/controllers/GeneralPageController.js'
                    ] 
                }]);
            }] 
        }
    })

    // Date & Time Pickers
    .state('pickers', {
        url: "/pickers",
        templateUrl: "views/pickers.html",
        data: {pageTitle: 'Date & Time Pickers'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/clockface/css/clockface.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                        '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        '../assets/global/plugins/clockface/js/clockface.js',
                        '../assets/global/plugins/moment.min.js',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                        '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                        '../assets/pages/scripts/components-date-time-pickers.min.js',

                        'js/controllers/GeneralPageController.js'
                    ] 
                }]);
            }] 
        }
    })

    // Custom Dropdowns
    .state('dropdowns', {
        url: "/dropdowns",
        templateUrl: "views/dropdowns.html",
        data: {pageTitle: 'Custom Dropdowns'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/select2/js/select2.full.min.js',

                        '../assets/pages/scripts/components-bootstrap-select.min.js',
                        '../assets/pages/scripts/components-select2.min.js',

                        'js/controllers/GeneralPageController.js'
                    ] 
                }]);
            }] 
        }
    }) 

    // Advanced Datatables
    .state('datatablesAdvanced', {
        url: "/datatables/managed.html",
        templateUrl: "views/datatables/managed.html",
        data: {pageTitle: 'Advanced Datatables'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [                             
                        '../assets/global/plugins/datatables/datatables.min.css', 
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        '../assets/pages/scripts/table-datatables-managed.min.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    // Ajax Datetables
    .state('datatablesAjax', {
        url: "/datatables/ajax.html",
        templateUrl: "views/datatables/ajax.html",
        data: {pageTitle: 'Ajax Datatables'},
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/datatables/datatables.min.css', 
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/global/scripts/datatable.min.js',

                        'js/scripts/table-ajax.js',
                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    // User Profile Dashboard
    .state("profile.dashboard", {
        url: "/dashboard",
        templateUrl: "views/profile/dashboard.html",
        data: {pageTitle: 'User Profile'}
    })

    // User Profile Help
    .state("profile.help", {
        url: "/help",
        templateUrl: "views/profile/help.html",
        data: {pageTitle: 'User Help'}
    })

    // Todo
    .state('todo', {
        url: "/todo",
        templateUrl: "views/todo.html",
        data: {pageTitle: 'Todo'},
        controller: "TodoController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',

                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        'js/controllers/TodoController.js'  
                    ]
                });
            }]
        }
    })*/
}]);



/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);
