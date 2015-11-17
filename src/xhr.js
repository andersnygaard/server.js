define("xhr", [], function () {

	var create = function () {

		var httpRequest;

		// Old compatibility code, no longer needed.
		if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
			httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 6 and older
			httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}

		return httpRequest;
	}

	return {
		create: create
	}
});