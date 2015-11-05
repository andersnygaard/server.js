"use strict";

// SimpleJsUnit and its testrunner is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. See http://creativecommons.org/licenses/by-sa/3.0/
//
// You are free:
// - to Share — to copy, distribute and transmit the work
// - to Remix — to adapt the work
// - to make commercial use of the work 
//
// Under the following conditions:
// - Attribution — You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work).
// - Share Alike — If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one. 
//
// https://twitter.com/#!/anders_nygaard

// Namespace/clas

(function(window) {

    window.testRunner = new function () {

        var self = this;

        // Properties
        this.testsRun = 0;
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.timeSpent = "";
        this.output = "";

        // Help functions
        var loadScript = function (src, callback) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');

            script.type = 'text/javascript';
            script.onreadystatechange = function () {
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    callback();
                }
            };
            script.onload = callback;
            script.src = src;

            head.appendChild(script);
        };

        var stopWatch = (function(){
            var date;

            return{
                start: function(){
                    date = new Date();
                },
                stop: function(){
                    return (new Date() - date);
                }
            }
        })();


        var resetTestRunner = function(){
            self.testsRun = 0;
            self.testsPassed = 0;
            self.testsFailed = 0;
            self.timeSpent = "";
        };

        this.run = function () {

            // Add jquery
            if (typeof jQuery === 'undefined') {
                loadScript('http://code.jquery.com/jquery.min.js', runAll);
            }
            else {
                runAll();
            }
        };

        var runAll = function () {

            var testResults = tests.run();

            // Dialog
            $("#testRunner_dialog").empty().remove();
            jQuery('<div id="testRunner_dialog" style="border: 3px solid #222222; background-color: #888888; position: absolute; top: 10px; right: 10px; min-height: 200px; width: 550px; padding: 0px;opacity:0.7;color:White;font-family:Arial;"><div style="width=100%;background-color:Black;color:White;padding: 3px 3px 5px 10px;font-weight:bold;">SimpleJsUnit Test Runner</div><div style="width:100%;float:left;background-color:#222222;"><div style="padding: 20px 10px 15px 10px;color:#ffffff;" id="testrunner_navigator"></div><div style="padding: 10px 10px 15px 10px;color:#ffffff;""><b>Results:</b><div style = "width:100%;border:1px solid #000000;background-color:#994444;height:10px;"><div id = "testrunner_percent" style = "width:30%;background-color:#449944;height:10px;"></div></div><div id = "testrunner_results"></div></div></div><div style="width:100%;float:left;background-color:#333333;max-height:250px;overflow:auto;"><div style="padding:10px;color:#ffffff;"><b>Output:</b><div id = "testrunner_output" style="color:#bfbfbf"></div></div></div><div style="width:100%;float:left;background-color:#222222;"><div style="padding:10px;text-align:center;font-size:12px;color:#888888;"><button id="testrunner_close">Close Test Runner</button></div></div></div>').appendTo($("body"));

            $("#testrunner_navigator").text(navigator.userAgent);
            $("#testrunner_percent").css("width", Math.floor((testResults.passed/testResults.numberOfTests)*100).toString() + "%");
            $("#testrunner_results").text("Total: " + testResults.run.toString() + ", passed: " + testResults.passed.toString() + ", failed: " + testResults.failed.toString() + ", time: " + testResults.time.toString());
            $("#testrunner_output").html(testResults.output);

            // Add events
            $("#testrunner_close").on("click", function (event) {
                $("#testRunner_dialog").empty().remove();
            });
        };
    };

}(window));