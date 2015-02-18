var nodePromise = require("node-promise");
var Promise = nodePromise.Promise;

var nconf = require('nconf');

var azure = require('azure-storage');
var tableService = azure.createTableService(nconf.get('STORAGE_ACCOUNT_NAME'), nconf.get('STORAGE_ACCOUNT_KEY'));

var service = {};

service.init = function() {
	tableService.createTableIfNotExists('AzureDayMain', function() {});
	tableService.createTableIfNotExists('AzureDayAgenda', function() {});
	tableService.createTableIfNotExists('AzureDayRegistration', function() {});
	tableService.createTableIfNotExists('AzureDaySpeakers', function() {});
	tableService.createTableIfNotExists('AzureDayLocations', function() {});
	tableService.createTableIfNotExists('AzureDayPartners', function() {});
	tableService.createTableIfNotExists('AzureDayTopics', function() {});
	tableService.createTableIfNotExists('AzureDayFeedback', function() {});
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

service.insertEntity = function(tableName, entity) {
	var promise = new Promise();

	tableService.insertEntity(tableName, entity, function(error, result, response){
		if (error) {
			var message = null;

			if (response.body['odata.error'].code === 'EntityAlreadyExists') {
				message = 'Указаный вами EMail уже зарегистрирован на конференцию.';
			}

			promise.resolve({'isError' : true, errorMessage: message });
		} else {
			promise.resolve({'isError' : false });
		}
	});

	return promise;
};

module.exports = service;