/* Setup general page controller */
angular.module('MetronicApp',['angularFileUpload']).controller('AddTopicController',
['$rootScope', '$scope', '$window', '$location', 'FileUploader', 'MainService', 'settings',
    function($rootScope, $scope, $window, $location, FileUploader, MainService, settings) {
        $("#markdown-textarea").markdown(
            {
                autofocus:false,
                savable:false
            }
        );

        var confirm_str = "确定要删除文件？";
        var def_option = {
            isUploaded : true,
            isSuccess : true,
            isNotAddingAll:true
        };

        $scope.topic = {};

        var uploader = $scope.uploader = new FileUploader(
            {
                url: options.api.base_url + options.api.topics + "/upload/" + $scope.topic.name,
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
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };

        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
            uploader.addToQueue("a.jsld",def_option);
            alert('All ');
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

        $scope.inputName = function inputName() {
            if ($scope.topic.name) {
                $scope.topic.new_name = $scope.topic.name;
            }
            $('#input_name').modal('toggle');
        }

        $scope.saveName = function saveName(t) {
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
                }
            }).error(function() {
                $('#input_name').modal('hide');
                handlError();
            });
        }

        $scope.removeItem = function removeItem(item) {
            var result = confirm(confirm_str);
            if(result){
                //
                item.remove();
            }
        }

        $scope.removeAll = function removeAll(uploader) {
            var result = confirm(confirm_str);
            if(result){
                //
                uploader.clearQueue();
            }
        }


        $scope.uploadItem = function(item) {
            if ($scope.topic.name) {
                item.upload();
            } else {
                alert("请先填写知识点名");
            }
        }

        $scope.cancelItem = function(item) {
            item.cancel();
        }


        //MainService.getSystemData('/').success(function(data){
        //    $scope.dashboard = data;
        //}).error(handlError);
        //

    }
]);
