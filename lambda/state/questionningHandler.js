'use strict';

const Alexa = require('alexa-sdk');
const eventSourcing = require('./Event/event');
const interaction = require('./helpers/interaction');

const stateContext = require('./stateContext');

const questionningHandlers = Alexa.CreateStateHandler(stateContext.states.QUESTIONNING, {

  'RepeatIntent': function() {
      interaction.repeatQuestion(this);
  },
  'AnswerIntent': function() {
      interaction.treatAnswer(this);
  },

  'AMAZON.HelpIntent': function() {
      interaction.helpQuestionning(this);
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

module.exports = questionningHandlers;
