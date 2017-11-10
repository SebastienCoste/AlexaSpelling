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
      return USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      return UKFirstNameSlot;
    }
  }

  if ( data.session && data.session.attributes && data.session.attributes['userName']){
    return data.session.attributes['userName'];
  }

  return undefined;
};
