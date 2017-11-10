
'use strict';

const Alexa = require('alexa-sdk');
// Helpers
const convertArrayToReadableString = require('./helpers/convertArrayToReadableString');
const getAWord = require('./helpers/words');

const eventSourcing = require('./Event/event');

const appId = "amzn1.ask.skill.11532793-2767-420b-ae38-e2ae5e5a397a";  // TODO replace with your app ID (OPTIONAL).



const handlers = {

  'NewSession': function () {
      beforeEachIntent("NewSession");

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

        this.emit(':ask', `Ok ${userName} ! Let\'s get started.`, 'say <break time="1s"/> "start" <break time="1s"/>  to start a contest');
      } else {
        this.emit(':ask', 'Sorry, I didn\'t recognise that name!', 'Tell me your name by saying: My name is, and then your name.');
      }
    },
    'StartIntent': function () {

        var word = getAWord();
        this.attributes['word'] = word;
        var number = word.trim().length;

        this.emit(':ask',
            `we\'re looking for a word of ${number} letters <break time="2s"/>  <say-as interpret-as="spell-out">${word}</say-as>` ,
            'I repeat <break time="1s"/>  <say-as interpret-as="spell-out">${word}</say-as>');
    },
    'AnswerIntent': function () {

        var userName = this.attributes['userName'];
        if (!userName){
            userName = "";
        }
        var word = this.attributes['word'];
        var answer = this.event.request.intent.slots.wordAnswer.value;

        if (!word){
            this.emit(':ask', ${userName} + ' start a contest by sating <break time="1s"/>  start', 'say <break time="1s"/>  start <break time="1s"/>  to start a contest.');
        } else if (!answer){
            this.emit(':ask', `I couldn\'t catch your answer ${userName} <break time="1s"/>  please repeat it`, 'please repeat your answer.');
        } else {
            if (word.trim().toLowerCase() === answer.trim().toLowerCase()){
                this.emit(':ask', `Congratulations ${userName} <break time="1s"/>  you found the word ${word}. say <break time="1s"/>  start <break time="1s"/>  to start another contest.`,
                    'say <break time="1s"/>  start <break time="1s"/>  to start another contest.');
            } else {
                this.emit(':ask', `Sorry ${userName} <break time="1s"/>  you said ${answer} but the answer was ${word}. say <break time="1s"/>  start <break time="1s"/>  to start another contest.`,
                    'say <break time="1s"/>  start <break time="1s"/>  to start another contest.');
            }
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
    eventSourcing(event.request).save();
    alexa.execute();
};


