
module.exports = function event(data){
  //SpellingContestEvent
  let intent = "NewSession";
  if (data.request && data.request.intent){
    intent = data.request.intent.name;
  }
  const sessionId = data.session.sessionId;
  const userId = data.session.user.userId;
  const timestamp = new Date();
    const self = {
        "event": data,
        "sessionId": sessionId,
        "userId": userId,
        "intent": intent,
        "date": timestamp,
        "timestamp": timestamp.getTime()

    };
    self.save = () => {
        console.log("TODO: save " +  self.timestamp );
    }

    return self;
}
