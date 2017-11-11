

const dynamo = require('../repository/dynamoDB.js');
const eventSourcing = require('./event');
const context = require('../repository/context');


module.exports = (function(){

    return {
      load = (pk) => {
          dynamo.get(context.getEventTableName(), context.getPkName(), pk, (err, data) =>
            {
                if (!err && data){
                    return data.map((e) => { eventSourcing(e)});
                }
            }
        );
      }
    };
    
}) ();
