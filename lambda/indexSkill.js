'use strict';

const Alexa = require('alexa-sdk');
// Helpers
const convertArrayToReadableString = require('./helpers/convertArrayToReadableString');
const getAWord = require('./helpers/words');
const eventSourcing = require('./Event/event');
const interaction = require('./helpers/interaction');

const appId = "amzn1.ask.skill.11532793-2767-420b-ae38-e2ae5e5a397a";  // TODO replace with your app ID (OPTIONAL).



const handlers =  {

  'NewSession': function() {
      interaction.launchRequest(this);
  },
  'LaunchRequest': function() {
      interaction.launchRequest(this);
  },

  'NameCapture': function() {
      interaction.captureName(this);
  },

  'StartIntent': function() {
      interaction.startContest(this);
  },
  'AnswerIntent': function() {
      interaction.treatAnswer(this);
  },
  'RepeatIntent': function() {
    interaction.repeatQuestion(this);

  },
  'AMAZON.HelpIntent': function() {
      interaction.help(this);

  },
  'AMAZON.CancelIntent': function() {
      interaction.cancel(this);

  },
  'AMAZON.StopIntent': function() {
    interaction.stopIt(this);

  },
  'StopIntent': function() {
    interaction.stopIt(this);

  },
  'SessionEndedRequest': function (){
    interaction.stopIt(this);

  }

};

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context, callback);
    alexa.appId = appId;
    // one new line to reference the DynamoDB table
    alexa.dynamoDBTableName = 'SpellingContest';
    alexa.registerHandlers(handlers);
    alexa.execute();
    eventSourcing({"event": event, "AWScontext": context}).save();
};
