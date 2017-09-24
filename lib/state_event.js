import Utils from './utils';

// TODO: Add support for CustomEvent
class StateEvent {
  constructor(type, detail) {
    this.type = type;
    this.detail = detail;
  }

  toString() {
    return this.type;
  }
}

const StateTimeout = new StateEvent('StateTimeout');
StateEvent.StateTimeout = StateTimeout;

/**
 * @param  {Any} event
 * @return {StateEvent}
 */
StateEvent.normalize = function(event) {
  switch (event.constructor.name) {
    case 'String':
      return new StateEvent(event);

    case 'StateEvent':
      return event;

    default:
      Utils.assert('Invalid value for state events');
  }
};

export default StateEvent;
