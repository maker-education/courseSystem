/* Setup general page controller */
angular.module('MetronicApp').controller('TopicController', 
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.delete_topic = function (tn) {
            var  topic_name = prompt("请输入知识点名称","知识点名");
            if (topic_name != tn) {
                var aa =1;
            }
            var result = confirm(confirm_str);
            var d = {};

            if (result) {
                MainService.postSystemData(options.api.topics + '/deleteall/' + $scope.topic.name, d)
                .success( function () {

                }).error( function () {
                    handlError();
                });
            }
        }

        $scope.overrideOptions = {};

        $scope.serverCallback = function ( sSource, aoData, fnCallback ) {
            MainService.postSystemData(options.api.topics + '/list', aoData)
            .success(function(data) {
                fnCallback(data);
            }).error(function() {
                handlError();
            });
        };


        $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            //预览
            $('td:eq(5) a:eq(0)', nRow).bind('click', function() {
                var data = aData.name;
                var url = options.api.base_url + options.api.topics + '/static/' + data + '/index';
                window.open(url);
            });

            //编辑
            $('td:eq(5) a:eq(1)', nRow).bind('click', function() {
                var data = aData.name;
                var path = '#/add_topic?tn=' + data;
                $window.location.assign(path);
            });

            //删除
            $('td:eq(5) a:eq(2)', nRow).bind('click', function() {

            });

            /*$('td:eq(2)', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.someClickHandler(aData);
                });
            });*/
            return nRow;
        };

        $scope.someClickHandler = function(info) {
            var a = 1;
        };
    }
]);

