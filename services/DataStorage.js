var nodePromise = require("node-promise");
var Promise = nodePromise.Promise;

var azure = require('azure-storage');
var tableService = azure.createTableService('azureua', 'H08CJ9AEAtvVwLiarDNS0ZRrYtpylzP7sV/GPxKgvEh0lejNKgM/kRWaV6uCg/KQT5Eze7vULwXtEAvu5FEQ+A==');

var service = {};

service.init = function() {
	//tableService.createTableIfNotExists('');
};

service.getEntities = function(tableName) {
	var promise = new Promise();

	tableService.queryEntities(tableName, null, null, function(error, result){
		promise.resolve(result.entries);
	});

	return promise;
};

module.exports = service;