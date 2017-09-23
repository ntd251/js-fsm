import State from './state';
import StateData from './state_data';

class StateTransition {
  constructor(options) {
    let defaultOptions = {
      state: undefined,
      stateData: undefined,
      stay: undefined,
      targetState: undefined,
      action: undefined,
    };

    Object.assign(this, defaultOptions, options);
  }

  when(state, stateData) {
    this.state = State.normalize(state);
    this.stateData = StateData.normalize(stateData);
    return this;
  }

  receive(event) {
    this.event = event;
    return this;
  }

  stay() {
    this.stay = true;
    return this;
  }

  goto(state) {
    this.targetState = State.normalize(state);
    return this;
  }

  using(action) {
    this.action = action;
    return this;
  }

  getKeys() {
    return [this.state.name, this.stateData.name, this.event];
  }
}

export default StateTransition;
