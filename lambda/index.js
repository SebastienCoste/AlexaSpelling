
'use strict';

const Alexa = require('alexa-sdk');
// Helpers
const convertArrayToReadableString = require('./helpers/convertArrayToReadableString');

const appId = "amzn1.ask.skill.11532793-2767-420b-ae38-e2ae5e5a397a";  // TODO replace with your app ID (OPTIONAL).



const handlers = {

  'NewSession': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
       if (userName) {
         // greet the user by name
         this.emit(':ask', `Welcome back ${userName}!`,  'What would you like to do?');
    } else {
      // Welcome User for the First Time
      this.emit(':ask', 'Welcome to spelling contest! Say ... "my name is" ... to bind your experience to you', 'Say "my name is" to bind your experience to you');
    }
  },
  'NameCapture': function () {
      // Get Slot Values
      var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
      var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

      // Get Name
      var userName;
      if (USFirstNameSlot) {
        userName = USFirstNameSlot;
      } else if (UKFirstNameSlot) {
        userName = UKFirstNameSlot;
      }

      // Save Name in Session Attributes
      if (userName) {
        this.attributes['userName'] = userName;
        this.emit(':ask', `Ok ${userName} ! Let\'s get started.`, 'say ... "start" ... to start a contest');
      } else {
        this.emit(':ask', 'Sorry, I didn\'t recognise that name!', 'Tell me your name by saying: My name is, and then your name.');
      }
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'speechOutput', 'reprompt');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'OK.');
    },
    'AMAZON.StopIntent': function () {
      var userName = this.attributes['userName'];
       if (userName) {
         this.emit(':tell', `Bye ${userName}!`);
      } else {
        this.emit(':tell', 'OK bye');
      }
    }

};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = appId;
    // one new line to reference the DynamoDB table
    alexa.dynamoDBTableName = 'HelloWorld';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
