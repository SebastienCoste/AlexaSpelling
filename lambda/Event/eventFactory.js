

const dynamo = require('../repository/dynamoDB.js');
const event = require('./event');
const context = require('../repository/context');


module.exports = (function(){

    return {
      load = (pkName, pk) => {

          console.log("load from " + context.getEventTableName());
      }

    };
}) ();
