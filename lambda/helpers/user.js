module.exports = function getUserName(data) {
  let userName = undefined;
  if (data.attributes && data.attributes['userName']){
    userName = data.attributes['userName'];
  }

  if (!userName
    && data.event
    && data.event.request
    && data.event.request.intent
    && data.event.request.intent.slots
    && data.event.request.intent.slots.USFirstName
    && data.event.request.intent.slots.UKFirstName){
    // Get Slot Values
    let USFirstNameSlot = data.event.request.intent.slots.USFirstName.value;
    let UKFirstNameSlot = data.event.request.intent.slots.UKFirstName.value;

    if (USFirstNameSlot) {
      userName = USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      userName = UKFirstNameSlot;
    }
  }
  return userName;
};
