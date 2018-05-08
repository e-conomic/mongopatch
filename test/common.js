/*jshint -W079 */
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var sinon = require('sinon');
var chai = require('chai');
var util = require('util');

require('mocha');

global.sinon = sinon;
global.chai = chai;
global.expect = chai.expect;

global.helper = require('./helper');

chai.config.includeStack = true;
chai.use(require('sinon-chai'));
chai.use(require('chai-pretty-expect'));

chai.Assertion.addChainableMethod('subset', function(expected) {
	var actual = this.__flags.object;

	var actualJson = JSON.stringify(actual);
	var expectedJson = JSON.stringify(expected);

	this.assert(
		sinon.match(expected).test(actual),
		util.format('expected %s to contain subset %s', actualJson, expectedJson),
		util.format('expected %s not to contain subset %s', actualJson, expectedJson),
		expected);
});


// setInterval(() =>{
// 	console.log('--process._getActiveRequests(), process._getActiveHandles()--', process._getActiveRequests().length, process._getActiveHandles().length);
//
// }, 5000);
