import State from './state';
import StateData from './state_data';

class AfterStateTransition {
  constructor(options) {
    let defaultOptions = {
      state: undefined,
      targetState: undefined,
      action: undefined,
    };

    Object.assign(this, defaultOptions, options);
  }

  from(state) {
    this.state = State.normalize(state);
    return this;
  }

  to(state) {
    this.targetState = State.normalize(state);
    return this;
  }

  do(action) {
    this.action = action;
    return this;
  }

  getKeys() {
    return [this.state.name, this.targetState];
  }
}

export default AfterStateTransition;
