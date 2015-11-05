(function (window) {
    "use strict";

    var Server = function () {
        var self = this;

        var fakes = {};

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
            this._period = 0;

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

                contentType = 'application/x-www-form-urlencoded';
                data = "";
                for (var key in payload) {
                    if (data !== "") {
                        data += "&";
                    }
                    data += encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]);
                }

                if (window.FormData !== undefined) {
                    data = new FormData()
                    data.append(payload);
                }
            };

            this.every = function (period) {
                period = period;

                var periodScope = function (scope) {
                    var scope = scope;
                    this.seconds = function () {
                        return scope;
                    }

                    this.minutes = function () {
                        scope._period = scope._period * 60;
                        return scope;
                    }
                }

                return {

                };
            }

            this.success = function (callback) {
                onSuccess = callback;
                return scope;
            };

            this.fail = function (callback) {
                onFail = callback;
                return scope;
            };
            this.send = function () {

                if (fakes[url]) {

                    var callCallbackWithFakeData = function () {
                        onSuccess(fakes[url]);
                    }

                    if (period !== 0) {
                        setInterval(callCallbackWithFakeData, period * 1000);
                    } else {
                        callCallbackWithFakeData();
                    }

                    return;
                }

                var callCalllBack = function () {
                    httpRequest.send(data);
                }

                httpRequest.open(method, url, true);
                if (method == "POST") {
                    if (contentType) {
                        httpRequest.setRequestHeader("Content-type", contentType);
                    }
                }

                if (period) {
                    callCalllBack();
                }else{
                    setInterval(callCalllBack, period * 1000);
                }
            };
        };

        this.post = function (url) {
            return new Request(url, "POST");
        };

        this.get = function (url) {
            return new Request(url, "GET");
        };

        this.fake = function (url, data) {
            fakes[url] = data;
        }
    }
    window.server = new Server();

} (window))