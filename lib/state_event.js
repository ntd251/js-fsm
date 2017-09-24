import Utils from './utils';

// TODO: Add support for CustomEvent
class StateEvent {
  constructor(event) {
    this.name = this.generateName(event);
    this.source = event;
  }

  generateName(event) {
    switch(event.constructor.name) {
      case 'Function':
        return `constructor___${event.name}`;

      case 'String':
        return event;
    }
  }

  toString() {
    return this.name;
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
    case 'Function':
    case 'String':
      return new StateEvent(event);

    default:
      Utils.assert('Invalid value for state events');
  }
};

export default StateEvent;
