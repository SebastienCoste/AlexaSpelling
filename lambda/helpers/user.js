module.exports = function getUserName(data) {

  if (data.event
    && data.event.request
    && data.event.request.intent
    && data.event.request.intent.slots
    && data.event.request.intent.slots.USFirstName
    && data.event.request.intent.slots.UKFirstName){
    // Get Slot Values
    let USFirstNameSlot = data.event.request.intent.slots.USFirstName.value;
    let UKFirstNameSlot = data.event.request.intent.slots.UKFirstName.value;

    if (USFirstNameSlot) {
      console.log("return " + USFirstNameSlot);
      return USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      console.log("return " + UKFirstNameSlot);
      return UKFirstNameSlot;
    }
  }

  if ( data.event.session && data.event.session.attributes && data.event.session.attributes['userName']){
    return data.event.session.attributes['userName'];
  }

  return undefined;
};
