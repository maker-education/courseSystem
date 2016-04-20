'use strict';

// TODO create proper module
MetronicApp.factory("fileReader", function ($q) {
    var onLoad = function (reader, deferred, Sscope) {
        return function () {
            Sscope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };
    var onError = function (reader, deferred, Sscope) {
        return function () {
            Sscope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };
    var onProgress = function (reader, Sscope) {
        return function (event) {
            Sscope.$broadcast(
                "fileProgress"
        , { total: event.total
          , loaded: event.loaded
        }
            );
        };
    };
    var getReader = function (deferred, Sscope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, Sscope);
        reader.onerror = onError(reader, deferred, Sscope);
        reader.onprogress = onProgress(reader, Sscope);
        return reader;
    };
    var readAsDataURL = function (file, Sscope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, Sscope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };
    return { readAsDataUrl: readAsDataURL };
});


MetronicApp.directive("ajFileSelect", function () {
    return {
        scope: {
            "ajChange": "&ajChange" ,
            "ajModel": "=ajModel"
        },
        link: function(dirScope, el) {
            el.bind("change", function(e) {
                dirScope.ajModel.file = (e.srcElement || e.target).files[0];
                console.log('ajFileSelect about to call getFile()', dirScope.ajModel);
                dirScope.ajChange();
            });
        }
    };
});


