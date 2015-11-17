define("Server", ["request"], function (request) {

	var Server = function () {
		var self = this;

		var fakes = {};

		this.post = function (url) {
			return new request.create(url, "POST");
		};

		this.get = function (url) {
			return new request.create(url, "GET");
		};

		this.fake = function (url, data) {
			fakes[url] = data;
		}
	}

	return Server;

});