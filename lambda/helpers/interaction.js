'use strict';

const getUserName = require('./user');
const getAWord = require('./words');

const stateContext = require('../state/stateContext');

module.exports = (function() {

  return {
    stopIt: (session) => {

      session.attributes['previousWord'] = undefined;
      session.attributes['previousAnswer'] = undefined;
      session.attributes['word'] = undefined;
      session.emit(':saveState', true); //Save the state when user quits
      let userName = session.attributes['userName'];
      if (userName) {
        session.emit(':tell', `Bye ${userName}!`);
      } else {
        session.emit(':tell', `OK bye`);
      }
    },

    newSession: (session) => {
      // Check for User Data in Session Attributes
      let userName = session.attributes['userName'];
      if (userName) {
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        return session.emitWithState('LaunchRequest')
      } else {
        // Welcome User for the First Time
        return session.emit(':ask', 'Welcome to spelling contest! Say ... "my name is" ... to bind your experience to you', 'Say "my name is" to bind your experience to you');
      }
    },

    launchRequest: (session) => {
      // Check for User Data in Session Attributes
      let userName = session.attributes['userName'];
      if (!userName) {
        session.handler.state = stateContext.states.IDENTIFICATION;
        session.emitWithState('NewSession')
      } else {
        // greet the user by name
        session.emit(':ask', `Welcome back ${userName}! say <break time="0.5s"/> "start" <break time="0.5s"/>  to start a contest, or <break time="0.5s"/> my name is <break time="0.5s"/> to change your name`,
          `say <break time="0.5s"/> "start" <break time="0.5s"/>  to start a contest, or <break time="0.5s"/> my name is <break time="0.5s"/> to change your name`);
      }
    },

    captureName: (session) => {
      let userName = getUserName(session);

      // Save Name in Session Attributes
      if (userName) {
        session.attributes['userName'] = userName;
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        session.emit(':ask', `Ok ${userName} ! Let\'s get started.`, `say <break time="0.5s"/> "start" <break time="0.5s"/>  to start a contest`);
      } else {
        session.emit(':ask', `Sorry, I didn\'t recognise that name!`, `Tell me your name by saying: My name is, and then your name.`);
      }
    },

    startContest: (session) => {
      var letterOrNumber = Math.floor(Math.random() * 2);
      if (letterOrNumber === 1){
        return startWordContest(session);
      } else {
        return startNumberContest(session);
      }
    },

    treatAnswer: (session) => {
      let userName = session.attributes['userName'];
      if (!userName) {
        userName = "";
      }
      let word = "" + session.attributes['word'];
      word = word.trim().toLowerCase();
      if(word === "start" || word === "again"){
        return session.emitWithState('StartIntent');
      }
      let wordAnswer = session.event.request.intent.slots.wordAnswer.value;
      let numberAnswer = session.event.request.intent.slots.numberAnswer.value;
      let answer = wordAnswer;
      if (!answer){
        answer = numberAnswer;
      }
      answer = "" + answer;

      if (!word) {
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        session.emit(':ask', `${userName} start a contest by sating <break time="0.5s"/>  start`, `say <break time="0.5s"/>  start a game <break time="0.5s"/>  to start a contest.`);
      } else if (!answer) {
        session.emit(':ask', `I couldn\'t catch your answer ${userName} <break time="0.5s"/>  please repeat it`, `please repeat your answer.`);
      } else {
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        session.attributes['previousWord'] = word;
        session.attributes['previousAnswer'] = answer;
        session.attributes['word'] = undefined;
        if (word === answer.trim().toLowerCase()) {
          session.emit(':ask', `Congratulations ${userName} <break time="0.5s"/>  you found the answer ${word}. say <break time="0.5s"/>  start a game <break time="0.5s"/>  to start another contest.`,
            `say <break time="0.5s"/>  start a game <break time="0.5s"/>  to start another contest.`);
        } else {
          session.emit(':ask', `Sorry ${userName} <break time="0.5s"/>  you said ${answer} but the answer was <emphasis level="strong">${word}</emphasis>. say <break time="0.5s"/>  start a game <break time="0.5s"/>  to start another contest.`,
            `say <break time="0.5s"/>  start a game <break time="0.5s"/>  to start another contest.`);
        }
      }
    },

    repeatQuestion: (session) => {
      let word = "" + session.attributes['word'];
      let userName = session.attributes['userName'];
      if (!userName) {
        userName = "";
      }
      if (!word) {
        session.emit(':ask', `${userName} start a contest by sating <break time="0.5s"/>  start`, `say <break time="0.5s"/>  start a game <break time="0.5s"/>  to start a contest.`);
      } else {
        let number = word.trim().length;

        session.emit(':ask',
          `the answer to guess is <break time="1s"/>  <emphasis level="strong"><say-as interpret-as="spell-out">${word}</say-as></emphasis>`,
          `I repeat <break time="0.5s"/>  <emphasis level="strong"><say-as interpret-as="spell-out">${word}</say-as></emphasis>`);
      }
    },

    helpIdentification: (session) => {
      session.emit(':ask', `say <break time="0.5s"/> my name is <break time="0.5s"/> to bind the game to you`,
        `say <break time="0.5s"/> my name is <break time="0.5s"/> to bind the game to you`);
    },

    helpQuestionning: (session) => {
      session.emit(':ask', `say <break time="0.5s"/>repeat <break time="0.5s"/> to repeat the question, or answer the question if you want another`,
        `say <break time="0.5s"/>repeat <break time="0.5s"/> to repeat the question, or answer the question if you want another`);
    },

    helpBetweenQuestions: (session) => {
      session.emit(':ask', `say <break time="0.5s"/>start a game <break time="0.5s"/> to start a game, or <break time="0.5s"/> my name is <break time="0.5s"/> to save your name`,
        `say <break time="0.5s"/>start a game <break time="0.5s"/> to start a game, or <break time="0.5s"/> my name is <break time="0.5s"/> to save your name`);
    },

    cancel: (session) => {
      session.emit(':tell', 'OK.');
    },
    unhandledBetweenQuestion: (session) => {

      //Sometimes Alexa mixes up the StartIntent and the AnswerIntent if the user says 1 word to restart a contest
      if (session.request.intent.name === "AnswerIntent"){
        let wordAnswer = session.event.request.intent.slots.wordAnswer.value;
        let numberAnswer = session.event.request.intent.slots.numberAnswer.value;
        let answer = wordAnswer;
        if (!answer){
          answer = numberAnswer;
        }
        answer = ("" + answer).trim().toLowerCase();
        if(answer === "start" || answer === "again"){
          return session.emitWithState('StartIntent');
        }
      }

      session.emitWithState('AMAZON.HelpIntent');
    },

    unhandled: (session) => {

      session.emitWithState('AMAZON.HelpIntent');
    }

  }
})();

function startWordContest(session){
  let word = getAWord();
  session.attributes['word'] = word;
  let number = word.trim().length;
  session.handler.state = stateContext.states.QUESTIONNING;

  session.emit(':ask',
    `we\'re looking for a word of ${number} letters <break time="1s"/>  <say-as interpret-as="spell-out">${word}</say-as>`,
    `I repeat <break time="0.5s"/>  <say-as interpret-as="spell-out">${word}</say-as>`);
}

function startNumberContest(session){
  const firstNumber = Math.floor(Math.random() * 99);
  const secondNumber = Math.floor(Math.random() * 99);
  let word = firstNumber + secondNumber;
  session.attributes['word'] = word;
  let number = ("" + word).trim().length;
  session.handler.state = stateContext.states.QUESTIONNING;

  session.emit(':ask',
    `we\'re looking for a number of ${number} digits <break time="1s"/>  <say-as interpret-as="spell-out">${firstNumber}</say-as> plus <say-as interpret-as="spell-out">${secondNumber}</say-as>`,
    `I repeat <break time="0.5s"/>  <say-as interpret-as="spell-out">${word}</say-as>`);
}
