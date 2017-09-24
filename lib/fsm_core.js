import State from './state';
import StateData from './state_data';
import StateTransition from './state_transition';
import AfterStateTransition from './after_state_transition';

const DEFAULT_PROPS = {
  _state: undefined,
  _stateData: undefined,
  _initialized: false,
  _actionStore: {},
  _transitionMap: {},
  _afterTransitionMap: {},
  _stateTimeoutMap: {},
  _config: {
    initialState: undefined,
    initialStateData: undefined,
    states: [],
    stateDataValues: [],
    usings: [],
    dos: [],
    transitions: [],
    events: [],
  }
};

class FsmCore {
  constructor() {
    this.assignDefaultProps();
  }

  initialize() {
    let state = this.getConfig('initialState');
    let stateData = this.getConfig('initialStateData');
    this.transitionTo(state, stateData);
    this._initialized = true;
  }

  isInitialized() {
    return this._initialized;
  }

  getState() {
    return this._state;
  }

  getStateData() {
    return this._stateData;
  }

  getConfig(name) {
    return this._config[name];
  }

  /**
   * @param  {String} name [description]
   * @return {Function}
   */
  getAction(name) {
    let store = this.getActionStore();
    return store[name];
  }

  getStates() {
    return this.getConfig('states');
  }

  getStateDataValues() {
    return this.getConfig('stateDataValues');
  }

  getStateTimeoutMap() {
    return this._stateTimeoutMap;
  }

  getTransitionMap() {
    return this._transitionMap;
  }

  getAfterTransitionMap() {
    return this._afterTransitionMap;
  }

  getActionStore() {
    return this._actionStore;
  }

  /**
   * @param  {Any} state
   * @param  {Any} stateData
   * @param  {Any} event
   * @param  {Any} targetState
   * @param  {Any} using
   * @return {StateTransition}
   */
  generateTransition(state, stateData, event, targetState, using) {
    let transition = new StateTransition();

    transition.when(state, stateData)
              .receive(event)
              .goto(targetState)
              .using(using);

    return transition;
  }

  generateStayTransition(state, stateData, event, using) {
    let transition = new StateTransition();

    transition.when(state, stateData)
              .receive(event)
              .stay()
              .using(using);

    return transition;
  }

  /**
   * @param  {Any} state
   * @param  {Any} targetState
   * @param  {Any} action
   * @return {AfterStateTransition}
   */
  generateAfterTransition(state, targetState, action) {
    let transition = new AfterStateTransition();

    transition.from(state)
              .to(targetState)
              .do(action);

    return transition;
  }

  registerInitialState(state) {
    this._config.initialState = state;
  }

  registerInitialStateData(stateData) {
    this._config.initialStateData = stateData;
  }

  registerState(state, stateTimeout) {
    // TODO: Support stateTimeout
    let states = this.getStates();

    if (!states.includes(state)) {
      states.push(state);
    }
  }

  registerStateData(stateData) {
    let values = this.getStateDataValues();

    if (!values.includes(stateData)) {
      values.push(stateData);
    }
  }

  /**
   * @param  {StateTransition} transition
   */
  registerTransition(transition) {
    this.updateTransitionMap(transition);
  }

  /**
   * @param  {StateTransition} transition
   */
  registerAfterTransition(transition) {
    this.updateAfterTransitionMap(transition);
  }

  /**
   * @param  {String}   name
   * @param  {Function} fn
   */
  registerAction(name, fn) {
    let store = this.getActionStore();
    store[name] = fn;
  }

  /**
   * @param  {Any} state
   * @param  {Number} period - in miliseconds
   */
  registerStateTimeout(state, period) {
    let timeoutMap = this.getStateTimeoutMap();
    state = State.normalizeState(state);
    timeoutMap[state] = priod;
  }

  /**
   * @param  {String} name
   */
  executeAction(name) {
    let actionFn = this.getAction(name);
    actionFn();
  }

  /**
   * Execute `using` function with the target event
   * @param  {Any} using - Function or function name
   * @param  {Any} event
   * @return {StateData} StateData
   */
  executeUsing(using, event) {
    let stateData = this.getStateData();

    switch(typeof using) {
      case 'function':
        return this.executeUsingByFunction(using, event);
        break;

      case 'string':
        return this.executeUsingByName(using, event);
        break;

      case undefined:
        return stateData;
        break;

      default:
        // TODO: raise error
        break;
    }
  }

  executeAction(action) {
    switch(typeof action) {
      case 'function':
        return action();
        break;

      case 'string':
        return this.executeActionByName(action);
        break;

      case undefined:
        // do nothing
        break;

      default:
        // TODO: raise error
        break;
    } 
  }

  /**
   * Execute `using` function with the target event
   * @param  {String} fnName
   * @param  {Any} event
   * @return {StateData} StateData
   */
  executeUsingByName(fnName, event) {
    let usingFn = this.getAction(fnName);
    return this.executeUsingByFunction(usingFn, event);
  }

  /**
   * Execute `using` function with the target event
   * @param  {Function} usingFn
   * @param  {Any} event
   * @return {StateData} StateData
   */
  executeUsingByFunction(usingFn, event) {
    let stateData = usingFn(event) || this.getStateData();
    this.validateStateData(stateData);
    return stateData;
  }

  executeActionByName(fnName) {
    let actionFn = this.getAction(fnName);
    actionFn();
  }

  assignDefaultProps() {
    Object.assign(this, DEFAULT_PROPS);
  }

  /**
   * @param  {String} event
   * @return {StateTransition}
   */
  getTransition(event) {
    let state = this.getState();
    let stateData = this.getStateData();
    let transitionMap = this.getTransitionMap();

    let stateTransitionMap = transitionMap[state] ||
                             transitionMap[State.Any] ||
                             {};

    let stateDataTransitionMap = stateTransitionMap[stateData] ||
                                 stateTransitionMap[StateData.Any] ||
                                 {};

    return stateDataTransitionMap[event] ||
           stateDataTransitionMap[`constructor___${event.constructor.name}`] ||
           this.getUnhandledTransition(event);
  }

  /**
   * @param  {State} state
   * @param  {State} targetState
   * @return {AfterStateTransition}
   */
  getAfterTransition(state, targetState) {
    let transitionMap = this.getAfterTransitionMap();
    let stateTransition = transitionMap[state] || transitionMap[State.Any] || {};

    return stateTransition[targetState] ||
           stateTransition[State.Any] ||
           this.getUnhandledAfterTransition(state, targetState);
  }

  getUnhandledTransition(event) {
    let state = this.getState();
    let stateData = this.getStateData();
    let transition = new StateTransition();
    transition.using(() => {
      console.debug(`Unhandled transition: ${state} [ ${stateData} receiving ${event}`);
    });
    return transition;
  }

  getUnhandledAfterTransition(state, targetState) {
    let transition = new AfterStateTransition();
    transition.do(() => {
      console.debug(`Unhandled after transition: ${state} to ${targetState}`);
    });
    return transition;
  }

  /**
   * Respond to the received event. Based on the current state and current stateData,
   * it decides the next state and next stateData.
   * @param  {Any} event
   */
  receive(event) {
    let state = this.getState();
    let transition = this.getTransition(event);
    let staying = transition.staying;
    let targetState = staying ? state : transition.targetState;
    let using = transition.action;

    console.debug(`Received ${event}`);

    /**
     * Before transition
     */
    let targetStateData = this.executeUsing(using, event);

    /**
     * Transition
     */
    this.transitionTo(targetState, targetStateData);

    /**
     * After transition
     */
    if (!staying) {
      let afterTransition = this.getAfterTransition(state, targetState);
      let action = afterTransition.action;
      this.executeAction(action);
    }
  }

  transitionTo(state, stateData) {
    if (state) {
      this._state = State.normalize(state);  
    }
    
    if (stateData) {
      this._stateData = StateData.normalize(stateData);
    }

    console.debug(`State: ${this.getState()} [ ${this.getStateData()} ]`);
  }

  validateStateData(stateData) {

  }

  /**
   * @param  {StateTransition} transition
   */
  updateTransitionMap(transition) {
    let keys = transition.getKeys();
    let json = this.getTransitionMap();
    this.deepUpdateJson(json, keys, transition);
  }

  /**
   * @param  {AfterStateTransition} transition
   */
  updateAfterTransitionMap(transition) {
    let keys = transition.getKeys();
    let json = this.getAfterTransitionMap();
    this.deepUpdateJson(json, keys, transition);
  }


  deepUpdateJson(json, keys, value) {
    keys.forEach((key, index) => {
      if (index < keys.length - 1) {
        json[key] = json[key] || {};
      } else {
        json[key] = value;
      }

      json = json[key];
    });
  }
}

export default FsmCore;
