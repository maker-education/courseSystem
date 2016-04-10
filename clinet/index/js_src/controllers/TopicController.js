/* Setup general page controller */
angular.module('MetronicApp').controller('TopicController', ['$rootScope', '$scope', '$window', '$location', 'settings',
    function($rootScope, $scope, $window, $location, settings) {


        var TableDatatablesManaged = $scope.TableDatatablesManaged = function () {
            var initTable1 = function () {
                var table = $('#sample_1');

                // begin first table
                table.dataTable({
                    "bSort": false,     //将来再支持排序
                    "ajax": {
                        "url" : options.api.base_url+ options.api.topics + "/list",
                        "type": "POST",
                        "error": $.ajaxSetup().error
                    },
                    "processing": true,
                    "serverSide": true,
                    "lengthMenu": [
                        [10, 25, 50,],
                        [10, 25, 50,] // change per page values here
                    ],
                    // set the initial value
                    "pageLength": 5,
                    "columns": [
                        { "data": "name" },
                        { "data": "autho_name" },
                        { "data": "create_time" },
                        { "data": "update_time" },
                    ],
                    "columnDefs": [
                        {
                            "targets": [4],
                            "data": "name",
                            "render": function(data, type, full) {
                                url = options.api.base_url + options.api.topics + '/static/' + data + '/index';
                                return "<a href='javascript:void(0);' onclick='window.open(\""+ url + "\")'>预览</a>";
                            }
                        },
                        {
                            "targets": [5],
                            "data": "name",
                            "render": function(data, type, full) {
                                return "<a href='#/add_topic?tn=" + data + "'>编辑</a>|\
                                    <a href='javascript:void(0); onclick=delete_topic("+ data +")'>删除</a>";
                            }
                        }
                    ]
                });
            }
            return {
                //main function to initiate the module
                init: function () {
                    if (!jQuery().dataTable) {
                        return;
                    }
                    initTable1();
                }
            };
        }();

        TableDatatablesManaged.init();
    }
]);
