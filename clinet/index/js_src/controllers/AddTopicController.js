/* Setup general page controller */
angular.module('MetronicApp',['angularFileUpload']).controller('AddTopicController',
['$rootScope', '$scope', '$window', '$location', 'FileUploader', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, FileUploader, MainService, settings) {
        $scope.topic = {};

        var confirm_str = "确定要删除文件？";
        var def_option = {
            isUploaded : true,
            isSuccess : true,
            isNotAddingAll:true
        };

        $("#markdown-textarea").markdown(
            {
                autofocus:false,
                savable:false
            }
        );

        var uploader = $scope.uploader = new FileUploader(
            {
                url: options.api.base_url + options.api.topics + "/upload/",
                headers: {
                    Authorization : 'Basic ' + $window.sessionStorage.token
                },
                queueLimit: 100,
            }
        );
        // FILTERS
        uploader.filters.push(
            {
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options)
                {
                    return this.queue.length < 20;
                }
            }
        );

        uploader.addToQueue("a.jsld",def_option);

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };

        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };

        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };

        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };

        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };

        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };

        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

        $scope.inputName = function () {
            if ($scope.topic.name) {
                $scope.topic.new_name = $scope.topic.name;
            }
            $('#input_name').modal('toggle');
        }

        $scope.saveName = function (t) {
            t.new_name = $.trim(t.new_name);  //去掉首尾空格
            if (!t.new_name) {
                alert("请填写名称");
                return;
            }
            if (t.name == t.new_name) {
                $('#input_name').modal('hide');
                return
            }

            MainService.postSystemData(options.api.topics + '/create/' + t.new_name, t)
            .success(function(data) {
                if (data.success) {
                    $scope.topic.name = t.new_name;
                    $('#input_name').modal('hide');
                } else if (data.error_info){
                    alert(data.error_info);
                } else {
                    alert("错误!");
                }
            }).error(function() {
                $('#input_name').modal('hide');
                handlError();
            });
        }

        $scope.removeItem = function (item) {
            if (!$scope.topic.name) {
                alert("请先输入知识点名称");
            }
            var result = confirm(confirm_str);
            if(result){
                var data = {
                    'topic_name': $scope.topic.name ,
                    'delete_file': item.file.name
                };
                MainService.postSystemData(options.api.topics + '/deletefile' , data)
                .success(function(data) {
                    if (data.success) {
                        item.remove();
                    } else if (data.error_info){
                        alert(data.error_info);
                    } else {
                        alert("错误!");
                    }
                }).error(function() {
                    handlError();
                });
            }
        }

        $scope.removeAll = function (uploader) {
            if (!$scope.topic.name) {
                alert("请先输入知识点名称");
            }
            var result = confirm(confirm_str);
            var d = {};
            if(result){
                MainService.postSystemData(options.api.topics + '/deleteall/' + $scope.topic.name, d)
                .success(function(data) {
                    if (data.success) {
                        uploader.clearQueue();
                    } else if (data.error_info){
                        alert(data.error_info);
                    } else {
                        alert("错误!");
                    }
                }).error(function() {
                    handlError();
                });
            }
        };


        $scope.uploadItem = function(item) {
            if ($scope.topic.name) {
                uploader.url = options.api.base_url + options.api.topics + "/upload/" + $scope.topic.name
                item.upload();
            } else {
                alert("请先填写知识点名");
            }
        };

        $scope.uploadAll = function (uploader) {
            if ($scope.topic.name) {
                uploader.url = options.api.base_url + options.api.topics + "/upload/" + $scope.topic.name
                uploader.uploadAll();
            } else {
                alert("请先填写知识点名");
            }
        };

        $scope.downloadfile = function (url) {
            MainService.httpgetSystemData(url)
            .success(function(data, status, hders) {
                var f = hders('Content-Disposition');
                var fs = [];
                if (f) fs = f.match(/filename=(.*)/);
                var filename = 'unknown';
                if (fs.length > 1) {
                    filename = utf8.decode(fs[1]);
                    filename = filename.replace(/[/\:*?"<>|]/g, "");
                }
                saveAs(data, filename, true);
            })
            .error(handlError);
        };

        $scope.saveppt = function(t) {
            if (!t.name) {
                alert("请先填写知识点名称");
                return;
            }

        }

        //MainService.getSystemData('/').success(function(data){
        //    $scope.dashboard = data;
        //}).error(handlError);
        //
    }
]);
