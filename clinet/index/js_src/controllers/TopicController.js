/* Setup general page controller */
angular.module('MetronicApp').controller('TopicController', 
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.delete_topic = function (t, tn, code) {
            var  topic_name = prompt("请输入知识点名称","知识点名");
            if (topic_name != tn) {
                alert('名称输入不正确');
                return;
            }
            var datatable = $(t).parents('table')

            MainService.postSystemData(options.api.topics + '/deletetopic/' + topic_name, {'code':code})
            .success( function (data) {
                if (data.success) {
                    alert("删除成功!");
                    datatable.DataTable().ajax.reload();//重新加载
                } else if (data.error_info){
                    alert(data.error_info);
                } else {
                    alert("错误!");
                }
            }).error( function () {
                handlError();
            });
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
            var topic_name = aData.name;
            //预览
            $('td:eq(5) a:eq(0)', nRow).bind('click', function() {
                var url = options.api.base_url + options.api.topics + '/static/' + topic_name + '/index';
                window.open(url);
            });

            //编辑
            $('td:eq(5) a:eq(1)', nRow).bind('click', function() {
                var path = '#/add_topic?tn=' + topic_name;
                $window.location.assign(path);
            });

            //删除
            $('td:eq(5) a:eq(2)', nRow).bind('click', function() {
                $scope.delete_topic(this, topic_name, aData.create_time);
            });

            /*$('td:eq(2)', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.someClickHandler(aData);
                });
            });*/
            return nRow;
        };
    }
]);

