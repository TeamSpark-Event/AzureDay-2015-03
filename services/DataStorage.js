var nodePromise = require("node-promise");
var Promise = nodePromise.Promise;

var azure = require('azure-storage');
var tableService = azure.createTableService('azureua', 'H08CJ9AEAtvVwLiarDNS0ZRrYtpylzP7sV/GPxKgvEh0lejNKgM/kRWaV6uCg/KQT5Eze7vULwXtEAvu5FEQ+A==');

var service = {};

service.init = function() {
	tableService.createTableIfNotExists('AzureDayMain', function() {});
	tableService.createTableIfNotExists('AzureDayAgenda', function() {});
	tableService.createTableIfNotExists('AzureDayRegistration', function() {});
	tableService.createTableIfNotExists('AzureDaySpeakers', function() {});
	tableService.createTableIfNotExists('AzureDayLocations', function() {});
	tableService.createTableIfNotExists('AzureDayPartners', function() {});
	tableService.createTableIfNotExists('AzureDayTopics', function() {});
};

service.getEntities = function(tableName, partitionKey, rowKey) {
	var promise = new Promise();

	var query = new azure.TableQuery();

	if (typeof(partitionKey) !== 'undefined') {
		query = query.where('PartitionKey eq ?', partitionKey);
	}

	if (typeof(rowKey) !== 'undefined') {
		query = query.where('RowKey eq ?', rowKey);
	}

	tableService.queryEntities(tableName, query, null, function(error, result){
		promise.resolve(result.entries);
	});

	return promise;
};

module.exports = service;