
module.exports = function event(data){
    const self = {
        data,
        "intent": data.request.intent.name,
        "timestamp": new Date()

    };
    self.save = () => {
        console.log("TODO: save " +  self.timestamp );
    }

    return self;
}