'use strict';

const Alexa = require('alexa-sdk');
// Helpers
const eventSourcing = require('./Event/event');

const appId = process.env.ALEXA_APP_ID;
const sessionTable = process.env.SESSION_TABLE;

const questionningHandlers = require('./state/questionningHandler');
const betweenQuestionsHandlers = require('./state/betweenQuestionsHandler');
const identificationHandlers = require('./state/identificationHandler');


exports.handler = function(event, context, callback) {
  let alexa = Alexa.handler(event, context, callback);
  alexa.appId = appId;
  alexa.dynamoDBTableName = sessionTable;
  alexa.registerHandlers(
    identificationHandlers,
    betweenQuestionsHandlers,
    questionningHandlers
  );
  alexa.execute();
  eventSourcing({
    "event": event,
    "AWScontext": context
  }).save();
};
