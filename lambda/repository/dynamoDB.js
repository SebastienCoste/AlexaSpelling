'use strict';
var aws = require('aws-sdk');
var doc;

module.exports = (function() {
    return {
        get: function(newTableParams, table, pkName, pk, skName, sk, callback) {
            if(!table) {
                callback('DynamoDB Table name is not set.', null);
            }

            if(!doc) {
                doc = new aws.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
            }

            var params = {
                Key: {
                    pkName: pk,
                    skName: sk
                },
                TableName: table,
                ConsistentRead: false
            };

            doc.get(params, function(err, data){
                if(err) {
                    console.log('get error: ' + JSON.stringify(err, null, 4));

                    if(err.code === 'ResourceNotFoundException' && newTableParams) {
                        var dynamoClient = new aws.DynamoDB();
                        newTableParams.TableName = table;
                        dynamoClient.createTable(newTableParams, function (err, data) {
                            if(err) {
                                console.log('Error creating table: ' + JSON.stringify(err, null, 4));
                            }
                            console.log('Creating table ' + table + ':\n' + JSON.stringify(data));
                            callback(err, {});
                        });
                    } else {
                        callback(err, null);
                    }
                } else {
                    if(isEmptyObject(data)) {
                        callback(null, {});
                    } else {
                        callback(null, data.Item.mapAttr);
                    }
                }
            });
        },

        set: function(table, eventContext, callback) {
            if(!table) {
                callback('DynamoDB Table name is not set.', null);
            }

            if(!doc) {
                doc = new aws.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
            }


            var params = {
                Item: eventContext.getEventItem(),
                TableName: table
            };

            doc.put(params, function(err, data) {
                if(err) {
                    console.log('Error during DynamoDB put:' + err);
                }
                callback(err, data);
            });
        }
    };
})();

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
