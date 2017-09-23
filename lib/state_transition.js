import StateData from './state_data';

class StateTransition() {
  constructor(options) {
    let defaultOptions = {
      state: undefined,
      stateData: undefined,
      stay: undefined,
      targetState: undefined,
      using: undefined,
    };

    Object.assign(this, defaultOptions, options);
  }

  when(state, stateData) {
    this.state = state;
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
    this.targetState = state;
    return this;
  }

  using(using) {
    this.using = using;
    return this;
  }

  /**
   * @return {Hash}
   */
  toJSON() {
    let json = {};
    let state = this.state;
    let stateData = this.stateData;
    let stay = this.stay || false;
    let targetState = this.targetState;
    let using = this.using;

    json[state] = {};
    json[state][stateData] = {};
    json[state][stateData][event] = {
      stay,
      goto: targetState,
      using,
    };

    return json;
  }
}

export default StateTransition;
