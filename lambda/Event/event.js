
'use strict';
const dynamo = require('../repository/dynamoDB.js');
const getUserName = require('../helpers/user');

const tableName = "SpellingContestEvent";

const newTableParams = {
    AttributeDefinitions: [
        {
            AttributeName: 'userId',
            AttributeType: 'S'
        },
        {
            AttributeName: 'userName',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'userId',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'userName',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};


module.exports = function event(data){
  //SpellingContestEvent
  let intent = "NewSession";
  if (data.request && data.request.intent){
    intent = data.request.intent.name;
  }

  let userName = getUserName(data);
  if (!userName){
    userName = "UNKNOWN";
  }

  const sessionId = data.session.sessionId;
  const userId = data.session.user.userId;
  const timestamp = new Date();
    const self = {
        "event": data,
        "sessionId": sessionId,
        "userId": userId,
        "userName": userName,
        "intent": intent,
        "date": timestamp,
        "timestamp": timestamp.getTime()

    };

    self.getEventItem = () => {
      return self;
    }

    self.save = () => {
        dynamo.set(tableName, self,
        (err, data) =>
          {
            if (err){
              console.log("Error saving an event: " + err);
            }
          }
      );
    }

    return self;
}
