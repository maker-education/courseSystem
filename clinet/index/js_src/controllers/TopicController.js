/* Setup general page controller */
angular.module('MetronicApp').controller('TopicController', 
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.delete_topic = function (t, tn, code) {
            var  topic_name = prompt("请输入知识点名称","知识点名");
            if (!topic_name) {
                return;
            } else if (topic_name != tn) {
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

        $scope.overrideOptions = {
            "processing": true,
            "serverSide": true,
            "bSort": false,     //将来再支持排序
            "bPaginate": true,
            "lengthMenu": [
                [5, 20, 50,],
                [5, 20, 50,] // change per page values here
            ],
            // set the initial value
            "pageLength": 5,
            "search": { "smart": false },
            "columns": [
                { "data": "name" },
                { "data": "autho_name" },
                { "data": "time" },
                { "data": "create_time" },
                { "data": "update_time" },
            ] ,
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
            ],
            "oLanguage" : { //主要用于设置各种提示文本
                "sProcessing" : "正在处理...", //设置进度条显示文本
                "sLengthMenu" : "每页_MENU_行",//显示每页多少条记录
                "sEmptyTable" : "没有找到记录",//没有记录时显示的文本
                "sZeroRecords" : "没有找到记录",//没有记录时显示的文本
                "sInfo" : "总共_TOTAL_个知识点，当前显示_START_至_END_",
                "sInfoEmpty" : "",//没记录时,关于记录数的显示文本
                "sSearch" : "搜索:",//搜索框前的文本设置
                "oPaginate" : {
                    "sFirst" : "首页",
                    "sLast" : "未页",
                    "sNext" : "下页",
                    "sPrevious" : "上页"
                }
            }
        }
    }
]);

