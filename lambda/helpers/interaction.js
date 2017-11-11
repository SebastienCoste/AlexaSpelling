'use strict';

const getUserName = require('./helpers/user');
const getAWord = require('./helpers/words');

module.exports = (function(){

    return {
      stopIt : (session) => {

          this.attributes['previousWord'] = undefined;
          this.attributes['previousAnswer'] = undefined;
          this.attributes['word'] = undefined;
          this.emit(':saveState', true); //Save the state when user quits
          let userName = session.attributes['userName'];
          if (userName) {
              session.emit(':tell', `Bye ${userName}!`);
          } else {
              session.emit(':tell', `OK bye`);
          }
        },

      launchRequest : (session) => {
          // Check for User Data in Session Attributes
        let userName = session.attributes['userName'];
           if (userName) {
             // greet the user by name
             session.emit(':ask', `Welcome back ${userName}! say <break time="0.5s"/> "start" <break time="0.5s"/>  to start a contest`,  `say <break time="0.5s"/> "start" <break time="0.5s"/>  to start a contest`);
          } else {
            // Welcome User for the First Time
            session.emit(':ask', 'Welcome to spelling contest! Say ... "my name is" ... to bind your experience to you', 'Say "my name is" to bind your experience to you');
          }
      },

      captureName: (session) => {
        let userName = getUserName(session);

        // Save Name in Session Attributes
        if (userName) {
          session.attributes['userName'] = userName;

          session.emit(':ask', `Ok ${userName} ! Let\'s get started.`, `say <break time="0.5s"/> "start" <break time="0.5s"/>  to start a contest`);
        } else {
          session.emit(':ask', `Sorry, I didn\'t recognise that name!`, `Tell me your name by saying: My name is, and then your name.`);
        }
      },

      startContest: (session) => {
        let word = getAWord();
        session.attributes['word'] = word;
        let number = word.trim().length;

        session.emit(':ask',
            `we\'re looking for a word of ${number} letters <break time="1s"/>  <say-as interpret-as="spell-out">${word}</say-as>` ,
            `I repeat <break time="0.5s"/>  <say-as interpret-as="spell-out">${word}</say-as>`);
      },

      treatAnswer: (session) => {
        let userName = session.attributes['userName'];
        if (!userName){
            userName = "";
        }
        let word = session.attributes['word'];
        let answer = session.event.request.intent.slots.wordAnswer.value;

        if (!word){
            session.emit(':ask', `${userName} start a contest by sating <break time="0.5s"/>  start`, `say <break time="0.5s"/>  start <break time="0.5s"/>  to start a contest.`);
        } else if (!answer){
            session.emit(':ask', `I couldn\'t catch your answer ${userName} <break time="0.5s"/>  please repeat it`, `please repeat your answer.`);
        } else {
            session.attributes['previousWord'] = word;
            session.attributes['previousAnswer'] = answer;
            session.attributes['word'] = undefined;
            if (word.trim().toLowerCase() === answer.trim().toLowerCase()){
                session.emit(':ask', `Congratulations ${userName} <break time="0.5s"/>  you found the word ${word}. say <break time="0.5s"/>  start <break time="0.5s"/>  to start another contest.`,
                    `say <break time="0.5s"/>  start <break time="0.5s"/>  to start another contest.`);
            } else {
                session.emit(':ask', `Sorry ${userName} <break time="0.5s"/>  you said ${answer} but the answer was <emphasis level="strong">${word}</emphasis>. say <break time="0.5s"/>  start <break time="0.5s"/>  to start another contest.`,
                    `say <break time="0.5s"/>  start <break time="0.5s"/>  to start another contest.`);
            }
        }
      },

      repeatQuestion: (session) => {
        let word = session.attributes['word'];
        if (!word){
            session.emit(':ask', `${userName} start a contest by sating <break time="0.5s"/>  start`, `say <break time="0.5s"/>  start <break time="0.5s"/>  to start a contest.`);
        } else{
          let number = word.trim().length;

          session.emit(':ask',
              `we\'re looking for a word of ${number} letters <break time="1s"/>  <emphasis level="strong"><say-as interpret-as="spell-out">${word}</say-as></emphasis>` ,
              `I repeat <break time="0.5s"/>  <emphasis level="strong"><say-as interpret-as="spell-out">${word}</say-as></emphasis>`);
        }
      },

      help: (session) => {
        session.emit(':ask', `say <break time="0.5s"/>start <break time="0.5s"/> to start a game, or` +
         ` <break time="0.5s"/> my name is <break time="0.5s"/> to save your name`,
         `say <break time="0.5s"/>start <break time="0.5s"/> to start a game, or` +
          ` <break time="0.5s"/> my name is <break time="0.5s"/> to save your name`);
      },

      cancel: (session) => {
        session.emit(':tell', 'OK.');
      }
    }
  }
) ();
