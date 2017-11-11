'use strict';

const Alexa = require('alexa-sdk');
const eventSourcing = require('./Event/event');
const interaction = require('./helpers/interaction');

const stateContext = require('./stateContext');

const identificationHandlers = Alexa.CreateStateHandler(stateContext.states.IDENTIFICATION, {
  'NewSession': function() {
      interaction.newSession(this);
  },
  'NameCapture': function() {
      interaction.captureName(this);
  },

  'AMAZON.HelpIntent': function() {
      interaction.helpIdentification(this);
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

module.exports = identificationHandlers;
