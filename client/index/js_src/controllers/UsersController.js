/* Setup general page controller */
angular.module('MetronicApp').controller('UsersController', 
['$rootScope', '$scope', '$window', '$location', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, MainService, settings) {

        $scope.user = {};

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
                { "data": "nick" },
                { "data": "name" },
                { "data": "create_time" },
                { "data": "sex" },
                { "data": "roles" },
                { "data": "birthday" },
            ] ,
            "columnDefs": [
                {
                    "targets": [6],
                    "data": "name",
                    "render": function(data, type, full) {
                        return "<a href='javascript:void(0);')'>编辑</a>|" +
                               "<a href='javascript:void(0);')'>禁用</a>";
                    }
                }
            ],
            "oLanguage" : { //主要用于设置各种提示文本
                "sProcessing" : "正在处理...", //设置进度条显示文本
                "sLengthMenu" : "每页_MENU_行",//显示每页多少条记录
                "sEmptyTable" : "没有找到记录",//没有记录时显示的文本
                "sZeroRecords" : "没有找到记录",//没有记录时显示的文本
                "sInfo" : "总共_TOTAL_个用户，当前显示_START_至_END_",
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


        $scope.serverCallback = function ( sSource, aoData, fnCallback ) {
            MainService.postSystemData(options.api.user + '/all', aoData)
            .success(function(data) {
                fnCallback(data);
            }).error(function() {
                handlError();
            });
        };


        $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var user_name = $('td:eq(1)', nRow).html();
            //编辑
            $('td:eq(6) a:eq(0)', nRow).bind('click', function( nRow ) {
                MainService.postSystemData(options.api.user + '/getone', { 'name': user_name } )
                .success(function(data) {
                    if (data.success) {
                        $scope.user = data.data;
                        $scope.name = user_name;
                        $('#users_add').modal('toggle');
                    } else if (data.error_info){
                        alert(data.error_info);
                    } else {
                        alert("错误!");
                    }
                }).error(function() {
                    handlError();
                });
            });

            //禁用
            $('td:eq(6) a:eq(1)', nRow).bind('click', function() {
                var al =1;
            });

            return nRow;
        };

        $scope.addUser = function() {
            $scope.user = {};
            $scope.name = null;
            $('#users_add').modal('toggle');
        };


        handleValidation = function() {
            var form = $('#user_add_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: true, // focus the last invalid input
                ignore: "",  // validate all fields including form hidden input
                rules: {
                    nick: {
                        minlength: 2,
                        required: true,
                    },
                    name: {
                        minlength: 4,
                        required: true,
                        stringCheck: true,
                    },
                    select_sex: {
                        required: true,
                    },
                    select_multi_role: {
                        required: true,
                    }
                },
                messages: { // custom messages for radio buttons and checkboxes
                    nick: {
                        minlength: "至少包含{0}个字符",
                        required: "请输入姓名"
                    },
                    name: {
                        minlength: "至少包含{0}个字符",
                        required: "请输入账号"
                    },
                    select_sex: {
                        required: "请选择性别"
                    },
                    select_multi_role: {
                        required: "至少选择一个角色"
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success.hide();
                    error.show();
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    url = options.api.user + '/add'
                    if ($scope.name) {
                        url = options.api.user + '/edit/' + $scope.name
                    }

                    MainService.postSystemData( url, $scope.user )
                    .success(function(data) {
                        if (data.success) {
                            alert("操作成功!");
                            $("#user_add_table").DataTable().ajax.reload();//重新加载
                        } else if (data.error_info){
                            alert(data.error_info);
                        } else {
                            alert("错误!");
                        }
                    }).error(function() {
                        handlError();
                    });

                }
            });
        }

        handleValidation();
    }
]);

