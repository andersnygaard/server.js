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


(function (window) {

    // Logging

    function log(text) {
        if(simpleJsUnit.logsToConsole){
            if (!"console" in window || typeof console == "undefined") {
                setupConsole();
            }
            console.log(text);
        }
    };


    // Console

    function setupConsole(){
        var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
        "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

        window.console = {};
        for (var i = 0; i < names.length; ++i)
            window.console[names[i]] = function() {}
    }


    // Stopwatch
    
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


    // Type checking

    function checkType(actual, expected, exception) {
        if (typeOf(actual) !== expected) {
            throw exception.toString();
        }
    };

    function typeOf(something) {
        var result = typeof something;
        try {
            switch (result) {
                case 'string':
                    break;
                case 'boolean':
                    break;
                case 'number':
                    break;
                case 'object':
                case 'function':
                    switch (something.constructor) {
                        case new String().constructor:
                            result = 'String';
                            break;
                        case new Boolean().constructor:
                            result = 'Boolean';
                            break;
                        case new Number().constructor:
                            result = 'Number';
                            break;
                        case new Array().constructor:
                            result = 'Array';
                            break;
                        case new RegExp().constructor:
                            result = 'RegExp';
                            break;
                        case new Date().constructor:
                            result = 'Date';
                            break;
                        case Function:
                            result = 'Function';
                            break;
                        default:
                            var m = something.constructor.toString().match(/function\s*([^( ]+)\(/);
                            if (m) {
                                result = m[1];
                            }
                            else {
                                break;
                            }
                    }
                break;
            }
        } finally {
            result = result.substr(0, 1).toUpperCase() + result.substr(1);
            return result;
        }
    };


    // Fluent assertions

    function FluentAssert(){
    
        var self = this;

        this.actual;

        this.should = function () {
            return self;
        };

        this.throwException = function (message) {
            assert.throwsException(self.actual, message);
        };

        this.beTrue = function (message) {
            assert.isTrue(self.actual, message);
        };

        this.beFalse = function (message) {
            assert.isFalse(self.actual, message);
        };

        this.beSameAs = function (expected, message) {
            assert.areEqual(self.actual, expected, message);
        };

        this.notBeSameAs = function (exptexted, message) {
            assert.areNotEqual(self.actual, exptexted, message);
        };

        this.beNull = function (message) {
            assert.isNull(self.actual, message);
        };

        this.notBeNull = function (message) {
            assert.isNotNull(self.actual, message);
        };

        this.beInstanceOf = function (expected, message) {
            assert.isInstanceOfType(self.actual, expected, message);
        };

        this.notBeInstanceOf = function (expected, message) {
            assert.isNotInstanceOfType(self.actual, expected, message);
        };

        this.fail = function (message) {
            assert.fail(message);
        }
    };


    // Asserts
    
    var assert = {
        throwsException: function (fn, message) {

            // Check input
            checkType(fn, "Function", "Invalid input parameter 'fn', expected function but got " +  typeOf(fn).toLowerCase());

            // Assert
            try {
                fn();
            } catch (e) {
                return;
            }

            if(message)
                throw message.toString();
            else
                throw "Provided function did not fail";
        },
        isTrue: function (actual, message) {

            // Check input
            checkType(actual, "Boolean", message ? message : "Invalid input parameter 'actual', expected boolean but got " +  typeOf(actual).toLowerCase());

            // Assert
            if (actual !== true) {
                throw message ? message : "Expected true but got " + actual.toString().toLowerCase();
            }

        },
        isFalse: function (actual, message) {

            // Check input
            checkType(actual, "Boolean", "Invalid input parameter 'actual', expected boolean but got " +  typeOf(actual).toLowerCase());

            // Assert
            if (actual !== false) {
                throw message ? message : "Expected false but got " + actual.toString().toLowerCase();
            }
        },
        areEqual: function (actual, expected, message) {

            // Assert
            if (expected !== actual) {
                throw message ? message : "Parameters are not equal: " + actual.toString().toLowerCase() + ", " + expected.toString().toLowerCase();
            }
        },
        areNotEqual: function (actual, expected, message) {

            // Assert
            if (expected === actual) {
                throw message ? message : "Parameters are equal: " + actual.toString().toLowerCase() + ", " + expected.toString().toLowerCase();
            }
        },
        isNull: function (actual, message) {

            // Assert
            if (actual !== null) {
                throw message ? message : "Expected null but got " + actual.toString().toLowerCase();
            }
        },
        isNotNull: function (actual, message) {

            // Assert
            if (actual === null) {
                throw message ? message : "Expected not null but got null";
            }
        },
        isInstanceOfType: function (actual, expected, message) {

            // Check input
            checkType(expected, "String", "Invalid input parameter 'expected', expected string but got " +  typeOf(expected).toLowerCase());

            // Assert
            if (typeOf(actual).toLowerCase() !== expected.toLowerCase()) {
                throw message ? message : "Expected " + expected.toString().toLowerCase() + " but got " + typeOf(actual).toString().toLowerCase();
            }
        },
        isNotInstanceOfType: function (actual, expected, message) {

            // Check input
            checkType(expected, "String", "Invalid input parameter 'expected', expected string but got " +  typeOf(expected).toLowerCase());

            // Assert
            if (typeOf(actual).toLowerCase() === expected.toLowerCase()) {
                throw message ? message : "Expected " + expected.toString().toLowerCase() + " to be different from " + typeOf(actual).toString().toLowerCase();
            }
        },
        fail: function (message) {

            // Just trow message
            throw message ? message : "Test failed";
        }
    };


    // tests
    
    var tests = new function(){
    
        var self = this;

        var tests = [];
        var setupCallbacks = [];
        var teardownCallbacks = [];

        this.clear = function(){
            self.tests = [];
            self.setupCallbacks = [];
            self.teardownCallbacks = [];
        };

        this.setup = {
            add: function (testgroup, fn) {

                // Check input
                checkType(testgroup, "String", "Invalid input, testGroup is not of type 'String'");
                checkType(fn, "Function", "Invalid input, fn is not of type 'Function'");

                // Add setup function
                var key = testgroup.toString();
                if (!(setupCallbacks.hasOwnProperty(key))) {
                    setupCallbacks[key] = [];
                }

                setupCallbacks[key] = fn;

                // Add to log
                log("Setup function added to '" + testgroup + "' test group");
            }
        };

        this.tearDown = {
            add: function (testgroup, fn) {

                // Check input
                checkType(testgroup, "String", "Invalid input, testGroup is not of type 'String'");
                checkType(fn, "Function", "Invalid input, fn is not of type 'Function'");

                // Add tearDown function
                var key = testgroup.toString();
                if (!(teardownCallbacks.hasOwnProperty(key))) {
                    teardownCallbacks[key] = [];
                }

                teardownCallbacks[key] = fn;

                // Add to log
                log("Teardown function added to '" + testgroup + "' test group");
            }
        };

        this.add = function (testGroup, fn) {

            // Check input
            checkType(testGroup, "String", "Invalid input, testGroup is not of type 'String'");
            checkType(fn, "Function", "Invalid input, fn is not of type 'Function'");

            // Add test
            var key = testGroup.toString();
            if (!(tests.hasOwnProperty(key))) {
                tests[key] = [];
            }

            tests[key].push(fn);

            // Add to log
            log("Test added to '" + testGroup + "' test group");
        };

        this.runSingle = function(key, index){
          
            // setup
            if (setupCallbacks.hasOwnProperty(key)) {
                setupCallbacks[key]();
            }

            // test
            tests[key][index]();

            // teardown
            if (teardownCallbacks.hasOwnProperty(key)) {
                teardownCallbacks[key]();
            }   
        };

        this.run = function () {

            var testResults = {
                numberOfTests: 0,
                run: 0,
                passed: 0,
                failed: 0,
                output: "",
                time: ""
            };

            stopWatch.start();

            var k, i;

            // each testgroup
            for (k in tests) {

                testResults.numberOfTests += tests[k].length;

                // each test
                for (i = 0; i < tests[k].length; i++) {

                    testResults.run++;

                    try {
                        self.runSingle(k, i);
                        testResults.passed++;
                    }
                    catch (e) {
                        testResults.failed++;

                        if (e) {
                            testResults.output += [k, "(", i.toString(), ") - ", e, "<br>"].join("");
                        }
                    }
                }
            }

            testResults.time = stopWatch.stop().toString() + " ms";

            // Add to log
            log(testResults.run.toString() + " test(s) run in " + testResults.time + ". " + testResults.passed.toString() + " test(s) passed, " + testResults.failed.toString() + " test(s) failed");

            return testResults;
        }
    }();

    var simpleJsUnit = new function(){

        this.logsToConsole = false;
        this.stub = function(){
            
            var addObject = function(name, output){
                this[name] = output;
                return this;
            };

            var addFunction = function(name, output){

                this[name] = function () {
                  if(output) 
                    return output;
                }
                return this;
            };

            return {
                addFunction: addFunction,
                andObject: addObject
            }
        };     
    };

    window.simpleJsUnit = simpleJsUnit;
    window.assert = assert;
    window.tests = tests;
    window.that = function (actual) {
        var assert = new FluentAssert();
        assert.actual = actual;
        return assert;
    };
})(window);