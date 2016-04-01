/* Setup general page controller */
angular.module('MetronicApp',['angularFileUpload']).controller('AddTopicController',
['$rootScope', '$scope', '$window', '$location', 'FileUploader', 'settings',
    function($rootScope, $scope, $window, $location, FileUploader, settings) {
        $("#markdown-textarea").markdown(
            {
                autofocus:false,
                savable:false
            }
        );

        var confirm_str = "确定要删除文件？";

        var uploader = $scope.uploader = new FileUploader(
            {
                url: options.api.base_url + options.api.topics + "/upload",
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
            var options = {isUploaded: true, isNotAddingAll:true};
            uploader.addToQueue("a.jsld",options);
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

        $scope.removeItem = function removeItem(item) {
            var result = confirm(confirm_str);
            if(result){
                item.remove();
            }
        }

        $scope.removeAll = function removeAll(uploader) {
            var result = confirm(confirm_str);
            if(result){
                uploader.clearQueue();
            }
        }
    }
]);
