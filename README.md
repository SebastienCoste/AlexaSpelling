# AlexaSpelling


Train yourself to recognize spelled wordAnswer

Current available intents:

## NameCapture
To make Alexa remember your name
```
NameCapture (please/ ) (no/to/ ) (call me/you can call me/my name is/I am/I'm/ ) ({USFirstName}/{UKFirstName}) (please/ )
```
## StartIntent
To start the challenge
```
StartIntent (please/ ) (for/to/ ) (going/go/starting/start/let's go/beginning/begin/commencing/commence/launching/launch/raising/raise) (the/a/a new/another/ )( /contest/game/match/it/) (again/ )
StartIntent (please/ ) (another/next/again/another one/last/a last) (please/ )
```
## RepeatIntent
Repeat it slower
```
RepeatIntent (please/ ) (repeat/say again/again/tell again) (it/) (please/ )
```
## AnswerIntent
To answer the challenge
```
AnswerIntent (I think/probably/maybe/perhaps/ ) (my/the/an/a) answer is {wordAnswer}
AnswerIntent (I think/probably/maybe/perhaps/ ) (is it/it is/it's/this is/that is/that's/is that/is this/ ) {wordAnswer}
```


## StopIntent
To help Alexa on the phone to stopIt
```
StopIntent (please/ ) (cancel/stop) (it/) (please/ )
```
