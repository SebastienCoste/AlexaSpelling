'use strict';

const Alexa = require('alexa-sdk');
// Helpers
const eventSourcing = require('./Event/event');

const appId = process.env.ALEXA_APP_ID;
const sessionTable = process.env.SESSION_TABLE;

const questionningHandlers = require('./state/questionningHandlers');
const betweenQuestionsHandlers = require('./state/betweenQuestionsHandlers');
const identificationHandlers = require('./state/identificationHandlers');


exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context, callback);
    alexa.appId = appId;
    // one new line to reference the DynamoDB table
    alexa.dynamoDBTableName = sessionTable;
    alexa.registerHandlers(
          identificationHandlers,
          betweenQuestionsHandlers,
          questionningHandlers
    );
    alexa.execute();
    eventSourcing({"event": event, "AWScontext": context}).save();
};
