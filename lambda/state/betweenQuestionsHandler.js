'use strict';

const Alexa = require('alexa-sdk');
const eventSourcing = require('./Event/event');
const interaction = require('./helpers/interaction');

const stateContext = require('./stateContext');

const betweenQuestionsHandlers = Alexa.CreateStateHandler(stateContext.states.BETWEEN_QUESTIONS, {

  'LaunchRequest': function() {
      interaction.launchRequest(this);
  },
  'NameCapture': function() {
      interaction.captureName(this);
  },
  'StartIntent': function() {
      interaction.startContest(this);
  },

  'AMAZON.HelpIntent': function() {
      interaction.helpBetweenQuestions(this);
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
  },
  'Unhandled': function(){
    interaction.unhandled(this);
  }
})

module.exports = betweenQuestionsHandlers;
