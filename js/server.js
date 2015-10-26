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

        var Request = function (url, method) {

            var scope = this;
            var data;
            var contentType;
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

            this.data = function (payload) {

                if (true || window.FormData == undefined) {
                    contentType = 'application/x-www-form-urlencoded';
                    data = {};
                    for (key in payload) {
                        data[payload[key].name] = payload[key].value;
                    }
                }
                else {
                    data = new FormData(payload)
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
                httpRequest.open(method, url, true);
                if (method == "POST") {
                    if (contentType) {
                        httpRequest.setRequestHeader("Content-type", contentType);
                    }
                    httpRequest.send(data);
                } else if (method == "GET") {
                    httpRequest.send();
                }
            };
        };

        this.post = function (url) {
            return new Request(url, "POST");
        };

        this.get = function (url) {
            return new Request(url, "GET");
        };
    }
    window.server = new Server();

} (window))