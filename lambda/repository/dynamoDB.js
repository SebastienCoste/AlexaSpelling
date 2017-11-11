'use strict';

var aws = require('aws-sdk');
var doc;

module.exports = (function() {
  return {
    get: function(table, pkName, pk, skName, sk, callback) {
      if (!table) {
        callback('DynamoDB Table name is not set.', null);
      }

      if (!doc) {
        doc = new aws.DynamoDB.DocumentClient({
          apiVersion: '2012-08-10'
        });
      }
      let eventKey = {};

      eventKey[pkName] = pk;
      if (skName && sk) {
        eventKey[skName] = sk;
      }

      var params = {
        Key: eventKey,
        TableName: table,
        ConsistentRead: false
      };

      doc.get(params, function(err, data) {
        if (err) {
          console.log('get error: ' + JSON.stringify(err, null, 4));


        } else {
          if (isEmptyObject(data)) {
            callback(null, {});
          } else {
            callback(null, data.Item);
          }
        }
      });
    },

    set: function(table, newTableParams, eventContext, callback) {
      if (!table) {
        callback('DynamoDB Table name is not set.', null);
      }

      if (!doc) {
        doc = new aws.DynamoDB.DocumentClient({
          apiVersion: '2012-08-10'
        });
      }


      var params = {
        Item: eventContext.getEventItem(),
        TableName: table
      };

      doc.put(params, function(err, data) {
        if (err && err.code === 'ResourceNotFoundException' && newTableParams) {
          var dynamoClient = new aws.DynamoDB();
          newTableParams.TableName = table;
          dynamoClient.createTable(newTableParams, function(err, data) {
            if (err) {
              console.log('Error creating table: ' + JSON.stringify(err, null, 4));
              return callback(err, {});
            } else {
              console.log('Creating table ' + table + ':\n' + JSON.stringify(data));
              doc.put(params, function(err, data) {
                if (err) {
                  console.log('Error during DynamoDB put:' + err);
                  return callback(err, {});
                } else {
                  return callback(err, data);
                }
              });
            }
          });
        } else if (err) {
          return callback(err, null);
        } else {
          return callback(err, data);
        }

      });
    }
  };
})();

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}
