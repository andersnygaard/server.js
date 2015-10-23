(function (window) {
    "use strict";

    var Server = function () {
        var self = this;

        var httpRequestFactory = {
            create: function () {

                var httpRequest;

                // Old compatibility code, no longer needed.
                if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
                    httpRequest = new XMLHttpRequest();
                } else if (window.ActiveXObject) { // IE 6 and older
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }

                return httpRequest;
            }
        };

        var Request = function (url) {

            var scope = this;
            var onSuccess, onFail;
            var response;

            var httpRequest = httpRequestFactory.create();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        if (typeof onSuccess === "function") {
                            onSuccess(httpRequest.responseText, httpRequest);
                        }
                    } else {
                        if (typeof onFail === "function") {
                            onFail(httpRequest);
                        }
                    }
                }
            };

            this.success = function (callback) {
                onSuccess = callback;
                return scope;
            };

            this.fail = function (callback) {
                onFail = callback;
                return scope;
            };
            this.send = function () {
                httpRequest.open('GET', url, true);
                httpRequest.send(null);
            };
        };

        this.post = function () {

        };

        this.get = function (url) {
            return new Request(url);
        };
    }
    window.server = new Server();

} (window))