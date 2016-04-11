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

/* Handle datatables Plugin Integration */
MetronicApp.directive('myTable', function() {
    return function (scope, element, attrs) {
        // apply DataTable options, use defaults if none specified by user
        var options = {};
        if (attrs.myTable.length > 0) {
            options = scope.$eval(attrs.myTable);
        } else {
            options = {
                "processing": true,
                "serverSide": true,
                "bSort": false,     //将来再支持排序
                "bPaginate": true,
                "lengthMenu": [
                    [2, 25, 50,],
                    [2, 25, 50,] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "columns": [
                    { "data": "name" },
                    { "data": "autho_name" },
                    { "data": "time" },
                    { "data": "create_time" },
                    { "data": "update_time" },
                ]
                    ,
                "columnDefs": [
                    {
                        "targets": [5],
                        "data": "name",
                        "render": function(data, type, full) {
                            return "<a href='javascript:void(0);')'>预览</a>|" +
                                   "<a href='javascript:void(0);')'>编辑</a>|" +
                                   "<a href='javascript:void(0);')'>删除</a>";
                        }
                    }
                ]
            };
        }

        if (attrs.fnRowCallback) {
            options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
        }

        if (attrs.fnServerCallback) {
            options["fnServerData"] = scope.$eval(attrs.fnServerCallback);
        }

        // apply the plugin
        var dataTable = element.dataTable(options);
    }
});
