import State from './state';
import StateData from './state_data';
import StateEvent from './state_event';

const DEFAULT_OPTIONS = {
  state: undefined,
  stateData: undefined,
  staying: undefined,
  targetState: undefined,
  action: undefined,
};

class StateTransition {
  constructor(options) {
    Object.assign(this, DEFAULT_OPTIONS, options);
  }

  when(state, stateData) {
    this.state = State.normalize(state);
    this.stateData = StateData.normalize(stateData);
    return this;
  }

  receive(event) {
    this.event = StateEvent.normalize(event);
    return this;
  }

  stay() {
    let isClean = this.staying === undefined && this.targetState === undefined;
    Utils.assert('Target state already declared', isClean);

    this.staying = true;
    return this;
  }

  goto(state) {
    let isClean = this.staying === undefined && this.targetState === undefined;
    Utils.assert('Target state already declared', isClean);

    this.targetState = State.normalize(state);
    this.staying = false;
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
