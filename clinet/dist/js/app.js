/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});
/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"
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
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
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

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
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
    $urlRouterProvider.otherwise("/dashboard.html");  

    $stateProvider

    // Dashboard
    .state('login', {
        url: "/login",
        views: {
            'app_all': {
                templateUrl: "views/login.html",
                data: {pageTitle: 'Login'},
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                '../assets/global/plugins/select2/js/select2.full.min.js',
                                '../assets/global/plugins/jquery.serializejson.min.js',
                                '../assets/pages/css/login-3.min.css',
                            ]
                        });
                    }]
                }
            }
        }
    })


        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
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
                            'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })

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
                            'js/controllers/GeneralPageController.js'
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

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',
                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
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

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
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
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);

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

angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);

angular.module('MetronicApp').controller('TodoController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
});
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

angular.module('MetronicApp').filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

angular.module('MetronicApp').controller('UISelectController', function($scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    $scope.disabled = undefined;
    $scope.searchEnabled = undefined;

    $scope.enable = function() {
        $scope.disabled = false;
    };

    $scope.disable = function() {
        $scope.disabled = true;
    };

    $scope.enableSearch = function() {
        $scope.searchEnabled = true;
    }

    $scope.disableSearch = function() {
        $scope.searchEnabled = false;
    }

    $scope.clear = function() {
        $scope.person.selected = undefined;
        $scope.address.selected = undefined;
        $scope.country.selected = undefined;
    };

    $scope.someGroupFn = function(item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };

    $scope.personAsync = {
        selected: "wladimir@email.com"
    };
    $scope.peopleAsync = [];

    $timeout(function() {
        $scope.peopleAsync = [{
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        }, {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        }, {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        }, {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        }, {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        }, {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        }, {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }, {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        }, {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        }, {
            name: 'Nicolás',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }];
    }, 3000);

    $scope.counter = 0;
    $scope.someFunction = function(item, model) {
        $scope.counter++;
        $scope.eventResult = {
            item: item,
            model: model
        };
    };

    $scope.removed = function(item, model) {
        $scope.lastRemoved = {
            item: item,
            model: model
        };
    };

    $scope.person = {};
    $scope.people = [{
        name: 'Adam',
        email: 'adam@email.com',
        age: 12,
        country: 'United States'
    }, {
        name: 'Amalie',
        email: 'amalie@email.com',
        age: 12,
        country: 'Argentina'
    }, {
        name: 'Estefanía',
        email: 'estefania@email.com',
        age: 21,
        country: 'Argentina'
    }, {
        name: 'Adrian',
        email: 'adrian@email.com',
        age: 21,
        country: 'Ecuador'
    }, {
        name: 'Wladimir',
        email: 'wladimir@email.com',
        age: 30,
        country: 'Ecuador'
    }, {
        name: 'Samantha',
        email: 'samantha@email.com',
        age: 30,
        country: 'United States'
    }, {
        name: 'Nicole',
        email: 'nicole@email.com',
        age: 43,
        country: 'Colombia'
    }, {
        name: 'Natasha',
        email: 'natasha@email.com',
        age: 54,
        country: 'Ecuador'
    }, {
        name: 'Michael',
        email: 'michael@email.com',
        age: 15,
        country: 'Colombia'
    }, {
        name: 'Nicolás',
        email: 'nicolas@email.com',
        age: 43,
        country: 'Colombia'
    }];

    $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    $scope.multipleDemo = {};
    $scope.multipleDemo.colors = ['Blue', 'Red'];
    $scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
    $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
    $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];


    $scope.address = {};
    $scope.refreshAddresses = function(address) {
        var params = {
            address: address,
            sensor: false
        };
        return $http.get(
            'http://maps.googleapis.com/maps/api/geocode/json', {
                params: params
            }
        ).then(function(response) {
            $scope.addresses = response.data.results;
        });
    };

    $scope.country = {};
    $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
        {
            name: 'Afghanistan',
            code: 'AF'
        }, {
            name: 'Åland Islands',
            code: 'AX'
        }, {
            name: 'Albania',
            code: 'AL'
        }, {
            name: 'Algeria',
            code: 'DZ'
        }, {
            name: 'American Samoa',
            code: 'AS'
        }, {
            name: 'Andorra',
            code: 'AD'
        }, {
            name: 'Angola',
            code: 'AO'
        }, {
            name: 'Anguilla',
            code: 'AI'
        }, {
            name: 'Antarctica',
            code: 'AQ'
        }, {
            name: 'Antigua and Barbuda',
            code: 'AG'
        }, {
            name: 'Argentina',
            code: 'AR'
        }, {
            name: 'Armenia',
            code: 'AM'
        }, {
            name: 'Aruba',
            code: 'AW'
        }, {
            name: 'Australia',
            code: 'AU'
        }, {
            name: 'Austria',
            code: 'AT'
        }, {
            name: 'Azerbaijan',
            code: 'AZ'
        }, {
            name: 'Bahamas',
            code: 'BS'
        }, {
            name: 'Bahrain',
            code: 'BH'
        }, {
            name: 'Bangladesh',
            code: 'BD'
        }, {
            name: 'Barbados',
            code: 'BB'
        }, {
            name: 'Belarus',
            code: 'BY'
        }, {
            name: 'Belgium',
            code: 'BE'
        }, {
            name: 'Belize',
            code: 'BZ'
        }, {
            name: 'Benin',
            code: 'BJ'
        }, {
            name: 'Bermuda',
            code: 'BM'
        }, {
            name: 'Bhutan',
            code: 'BT'
        }, {
            name: 'Bolivia',
            code: 'BO'
        }, {
            name: 'Bosnia and Herzegovina',
            code: 'BA'
        }, {
            name: 'Botswana',
            code: 'BW'
        }, {
            name: 'Bouvet Island',
            code: 'BV'
        }, {
            name: 'Brazil',
            code: 'BR'
        }, {
            name: 'British Indian Ocean Territory',
            code: 'IO'
        }, {
            name: 'Brunei Darussalam',
            code: 'BN'
        }, {
            name: 'Bulgaria',
            code: 'BG'
        }, {
            name: 'Burkina Faso',
            code: 'BF'
        }, {
            name: 'Burundi',
            code: 'BI'
        }, {
            name: 'Cambodia',
            code: 'KH'
        }, {
            name: 'Cameroon',
            code: 'CM'
        }, {
            name: 'Canada',
            code: 'CA'
        }, {
            name: 'Cape Verde',
            code: 'CV'
        }, {
            name: 'Cayman Islands',
            code: 'KY'
        }, {
            name: 'Central African Republic',
            code: 'CF'
        }, {
            name: 'Chad',
            code: 'TD'
        }, {
            name: 'Chile',
            code: 'CL'
        }, {
            name: 'China',
            code: 'CN'
        }, {
            name: 'Christmas Island',
            code: 'CX'
        }, {
            name: 'Cocos (Keeling) Islands',
            code: 'CC'
        }, {
            name: 'Colombia',
            code: 'CO'
        }, {
            name: 'Comoros',
            code: 'KM'
        }, {
            name: 'Congo',
            code: 'CG'
        }, {
            name: 'Congo, The Democratic Republic of the',
            code: 'CD'
        }, {
            name: 'Cook Islands',
            code: 'CK'
        }, {
            name: 'Costa Rica',
            code: 'CR'
        }, {
            name: 'Cote D\'Ivoire',
            code: 'CI'
        }, {
            name: 'Croatia',
            code: 'HR'
        }, {
            name: 'Cuba',
            code: 'CU'
        }, {
            name: 'Cyprus',
            code: 'CY'
        }, {
            name: 'Czech Republic',
            code: 'CZ'
        }, {
            name: 'Denmark',
            code: 'DK'
        }, {
            name: 'Djibouti',
            code: 'DJ'
        }, {
            name: 'Dominica',
            code: 'DM'
        }, {
            name: 'Dominican Republic',
            code: 'DO'
        }, {
            name: 'Ecuador',
            code: 'EC'
        }, {
            name: 'Egypt',
            code: 'EG'
        }, {
            name: 'El Salvador',
            code: 'SV'
        }, {
            name: 'Equatorial Guinea',
            code: 'GQ'
        }, {
            name: 'Eritrea',
            code: 'ER'
        }, {
            name: 'Estonia',
            code: 'EE'
        }, {
            name: 'Ethiopia',
            code: 'ET'
        }, {
            name: 'Falkland Islands (Malvinas)',
            code: 'FK'
        }, {
            name: 'Faroe Islands',
            code: 'FO'
        }, {
            name: 'Fiji',
            code: 'FJ'
        }, {
            name: 'Finland',
            code: 'FI'
        }, {
            name: 'France',
            code: 'FR'
        }, {
            name: 'French Guiana',
            code: 'GF'
        }, {
            name: 'French Polynesia',
            code: 'PF'
        }, {
            name: 'French Southern Territories',
            code: 'TF'
        }, {
            name: 'Gabon',
            code: 'GA'
        }, {
            name: 'Gambia',
            code: 'GM'
        }, {
            name: 'Georgia',
            code: 'GE'
        }, {
            name: 'Germany',
            code: 'DE'
        }, {
            name: 'Ghana',
            code: 'GH'
        }, {
            name: 'Gibraltar',
            code: 'GI'
        }, {
            name: 'Greece',
            code: 'GR'
        }, {
            name: 'Greenland',
            code: 'GL'
        }, {
            name: 'Grenada',
            code: 'GD'
        }, {
            name: 'Guadeloupe',
            code: 'GP'
        }, {
            name: 'Guam',
            code: 'GU'
        }, {
            name: 'Guatemala',
            code: 'GT'
        }, {
            name: 'Guernsey',
            code: 'GG'
        }, {
            name: 'Guinea',
            code: 'GN'
        }, {
            name: 'Guinea-Bissau',
            code: 'GW'
        }, {
            name: 'Guyana',
            code: 'GY'
        }, {
            name: 'Haiti',
            code: 'HT'
        }, {
            name: 'Heard Island and Mcdonald Islands',
            code: 'HM'
        }, {
            name: 'Holy See (Vatican City State)',
            code: 'VA'
        }, {
            name: 'Honduras',
            code: 'HN'
        }, {
            name: 'Hong Kong',
            code: 'HK'
        }, {
            name: 'Hungary',
            code: 'HU'
        }, {
            name: 'Iceland',
            code: 'IS'
        }, {
            name: 'India',
            code: 'IN'
        }, {
            name: 'Indonesia',
            code: 'ID'
        }, {
            name: 'Iran, Islamic Republic Of',
            code: 'IR'
        }, {
            name: 'Iraq',
            code: 'IQ'
        }, {
            name: 'Ireland',
            code: 'IE'
        }, {
            name: 'Isle of Man',
            code: 'IM'
        }, {
            name: 'Israel',
            code: 'IL'
        }, {
            name: 'Italy',
            code: 'IT'
        }, {
            name: 'Jamaica',
            code: 'JM'
        }, {
            name: 'Japan',
            code: 'JP'
        }, {
            name: 'Jersey',
            code: 'JE'
        }, {
            name: 'Jordan',
            code: 'JO'
        }, {
            name: 'Kazakhstan',
            code: 'KZ'
        }, {
            name: 'Kenya',
            code: 'KE'
        }, {
            name: 'Kiribati',
            code: 'KI'
        }, {
            name: 'Korea, Democratic People\'s Republic of',
            code: 'KP'
        }, {
            name: 'Korea, Republic of',
            code: 'KR'
        }, {
            name: 'Kuwait',
            code: 'KW'
        }, {
            name: 'Kyrgyzstan',
            code: 'KG'
        }, {
            name: 'Lao People\'s Democratic Republic',
            code: 'LA'
        }, {
            name: 'Latvia',
            code: 'LV'
        }, {
            name: 'Lebanon',
            code: 'LB'
        }, {
            name: 'Lesotho',
            code: 'LS'
        }, {
            name: 'Liberia',
            code: 'LR'
        }, {
            name: 'Libyan Arab Jamahiriya',
            code: 'LY'
        }, {
            name: 'Liechtenstein',
            code: 'LI'
        }, {
            name: 'Lithuania',
            code: 'LT'
        }, {
            name: 'Luxembourg',
            code: 'LU'
        }, {
            name: 'Macao',
            code: 'MO'
        }, {
            name: 'Macedonia, The Former Yugoslav Republic of',
            code: 'MK'
        }, {
            name: 'Madagascar',
            code: 'MG'
        }, {
            name: 'Malawi',
            code: 'MW'
        }, {
            name: 'Malaysia',
            code: 'MY'
        }, {
            name: 'Maldives',
            code: 'MV'
        }, {
            name: 'Mali',
            code: 'ML'
        }, {
            name: 'Malta',
            code: 'MT'
        }, {
            name: 'Marshall Islands',
            code: 'MH'
        }, {
            name: 'Martinique',
            code: 'MQ'
        }, {
            name: 'Mauritania',
            code: 'MR'
        }, {
            name: 'Mauritius',
            code: 'MU'
        }, {
            name: 'Mayotte',
            code: 'YT'
        }, {
            name: 'Mexico',
            code: 'MX'
        }, {
            name: 'Micronesia, Federated States of',
            code: 'FM'
        }, {
            name: 'Moldova, Republic of',
            code: 'MD'
        }, {
            name: 'Monaco',
            code: 'MC'
        }, {
            name: 'Mongolia',
            code: 'MN'
        }, {
            name: 'Montserrat',
            code: 'MS'
        }, {
            name: 'Morocco',
            code: 'MA'
        }, {
            name: 'Mozambique',
            code: 'MZ'
        }, {
            name: 'Myanmar',
            code: 'MM'
        }, {
            name: 'Namibia',
            code: 'NA'
        }, {
            name: 'Nauru',
            code: 'NR'
        }, {
            name: 'Nepal',
            code: 'NP'
        }, {
            name: 'Netherlands',
            code: 'NL'
        }, {
            name: 'Netherlands Antilles',
            code: 'AN'
        }, {
            name: 'New Caledonia',
            code: 'NC'
        }, {
            name: 'New Zealand',
            code: 'NZ'
        }, {
            name: 'Nicaragua',
            code: 'NI'
        }, {
            name: 'Niger',
            code: 'NE'
        }, {
            name: 'Nigeria',
            code: 'NG'
        }, {
            name: 'Niue',
            code: 'NU'
        }, {
            name: 'Norfolk Island',
            code: 'NF'
        }, {
            name: 'Northern Mariana Islands',
            code: 'MP'
        }, {
            name: 'Norway',
            code: 'NO'
        }, {
            name: 'Oman',
            code: 'OM'
        }, {
            name: 'Pakistan',
            code: 'PK'
        }, {
            name: 'Palau',
            code: 'PW'
        }, {
            name: 'Palestinian Territory, Occupied',
            code: 'PS'
        }, {
            name: 'Panama',
            code: 'PA'
        }, {
            name: 'Papua New Guinea',
            code: 'PG'
        }, {
            name: 'Paraguay',
            code: 'PY'
        }, {
            name: 'Peru',
            code: 'PE'
        }, {
            name: 'Philippines',
            code: 'PH'
        }, {
            name: 'Pitcairn',
            code: 'PN'
        }, {
            name: 'Poland',
            code: 'PL'
        }, {
            name: 'Portugal',
            code: 'PT'
        }, {
            name: 'Puerto Rico',
            code: 'PR'
        }, {
            name: 'Qatar',
            code: 'QA'
        }, {
            name: 'Reunion',
            code: 'RE'
        }, {
            name: 'Romania',
            code: 'RO'
        }, {
            name: 'Russian Federation',
            code: 'RU'
        }, {
            name: 'Rwanda',
            code: 'RW'
        }, {
            name: 'Saint Helena',
            code: 'SH'
        }, {
            name: 'Saint Kitts and Nevis',
            code: 'KN'
        }, {
            name: 'Saint Lucia',
            code: 'LC'
        }, {
            name: 'Saint Pierre and Miquelon',
            code: 'PM'
        }, {
            name: 'Saint Vincent and the Grenadines',
            code: 'VC'
        }, {
            name: 'Samoa',
            code: 'WS'
        }, {
            name: 'San Marino',
            code: 'SM'
        }, {
            name: 'Sao Tome and Principe',
            code: 'ST'
        }, {
            name: 'Saudi Arabia',
            code: 'SA'
        }, {
            name: 'Senegal',
            code: 'SN'
        }, {
            name: 'Serbia and Montenegro',
            code: 'CS'
        }, {
            name: 'Seychelles',
            code: 'SC'
        }, {
            name: 'Sierra Leone',
            code: 'SL'
        }, {
            name: 'Singapore',
            code: 'SG'
        }, {
            name: 'Slovakia',
            code: 'SK'
        }, {
            name: 'Slovenia',
            code: 'SI'
        }, {
            name: 'Solomon Islands',
            code: 'SB'
        }, {
            name: 'Somalia',
            code: 'SO'
        }, {
            name: 'South Africa',
            code: 'ZA'
        }, {
            name: 'South Georgia and the South Sandwich Islands',
            code: 'GS'
        }, {
            name: 'Spain',
            code: 'ES'
        }, {
            name: 'Sri Lanka',
            code: 'LK'
        }, {
            name: 'Sudan',
            code: 'SD'
        }, {
            name: 'Suriname',
            code: 'SR'
        }, {
            name: 'Svalbard and Jan Mayen',
            code: 'SJ'
        }, {
            name: 'Swaziland',
            code: 'SZ'
        }, {
            name: 'Sweden',
            code: 'SE'
        }, {
            name: 'Switzerland',
            code: 'CH'
        }, {
            name: 'Syrian Arab Republic',
            code: 'SY'
        }, {
            name: 'Taiwan, Province of China',
            code: 'TW'
        }, {
            name: 'Tajikistan',
            code: 'TJ'
        }, {
            name: 'Tanzania, United Republic of',
            code: 'TZ'
        }, {
            name: 'Thailand',
            code: 'TH'
        }, {
            name: 'Timor-Leste',
            code: 'TL'
        }, {
            name: 'Togo',
            code: 'TG'
        }, {
            name: 'Tokelau',
            code: 'TK'
        }, {
            name: 'Tonga',
            code: 'TO'
        }, {
            name: 'Trinidad and Tobago',
            code: 'TT'
        }, {
            name: 'Tunisia',
            code: 'TN'
        }, {
            name: 'Turkey',
            code: 'TR'
        }, {
            name: 'Turkmenistan',
            code: 'TM'
        }, {
            name: 'Turks and Caicos Islands',
            code: 'TC'
        }, {
            name: 'Tuvalu',
            code: 'TV'
        }, {
            name: 'Uganda',
            code: 'UG'
        }, {
            name: 'Ukraine',
            code: 'UA'
        }, {
            name: 'United Arab Emirates',
            code: 'AE'
        }, {
            name: 'United Kingdom',
            code: 'GB'
        }, {
            name: 'United States',
            code: 'US'
        }, {
            name: 'United States Minor Outlying Islands',
            code: 'UM'
        }, {
            name: 'Uruguay',
            code: 'UY'
        }, {
            name: 'Uzbekistan',
            code: 'UZ'
        }, {
            name: 'Vanuatu',
            code: 'VU'
        }, {
            name: 'Venezuela',
            code: 'VE'
        }, {
            name: 'Vietnam',
            code: 'VN'
        }, {
            name: 'Virgin Islands, British',
            code: 'VG'
        }, {
            name: 'Virgin Islands, U.S.',
            code: 'VI'
        }, {
            name: 'Wallis and Futuna',
            code: 'WF'
        }, {
            name: 'Western Sahara',
            code: 'EH'
        }, {
            name: 'Yemen',
            code: 'YE'
        }, {
            name: 'Zambia',
            code: 'ZM'
        }, {
            name: 'Zimbabwe',
            code: 'ZW'
        }
    ];
});
angular.module('MetronicApp').controller('UserProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
}); 

var TableAjax = function () {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            autoclose: true
        });
    }

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (grid) {
                // execute some code after table records loaded
            },
            onError: function (grid) {
                // execute some code on network or other general error  
            },
            loadingMessage: 'Loading...',
            dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options 

                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/scripts/datatable.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [10, 20, 50, 100, 150, -1],
                    [10, 20, 50, 100, 150, "All"] // change per page values here
                ],
                "pageLength": 10, // default record count per page
                "ajax": {
                    "url": "demo/table_ajax.php", // ajax source
                },
                "order": [
                    [1, "asc"]
                ] // set first column as a default sort by asc
            }
        });

        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            if (action.val() != "" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
                grid.getDataTable().ajax.reload();
                grid.clearAjaxParams();
            } else if (action.val() == "") {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });
    }

    return {

        //main function to initiate the module
        init: function () {

            initPickers();
            handleRecords();
        }

    };

}();