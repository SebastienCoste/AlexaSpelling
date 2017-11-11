'use strict';

const dynamo = require('../repository/dynamoDB.js');
const getUserName = require('../helpers/user');
const context = require('../repository/context');

module.exports = function event(data) {
  //SpellingContestEvent
  let intent = "NewSession";
  if (data.event.request && data.event.request.intent) {
    intent = data.event.request.intent.name;
  }

  let userName = getUserName(data);
  if (!userName) {
    userName = "UNKNOWN";
  }

  const sessionId = data.event.session.sessionId;
  const userId = data.event.session.user.userId;
  const timestamp = new Date();
  const self = {
    "event": data,
    "sessionId": sessionId,
    "userId": userId,
    "userName": userName,
    "intent": intent,
    "date": timestamp.toString(),
    "timestamp": timestamp.getTime()

  };

  self.getEventItem = () => {
    return self;
  }

  self.save = () => {
    dynamo.set(context.getEventTableName(), context.getEventTableSchema(), self,
      (err, data) => {
        if (err) {
          console.log("Error saving an event: " + err);
        }
      }
    );
  }

  return self;
}
