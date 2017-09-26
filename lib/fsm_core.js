import State from './state';
import StateData from './state_data';
import StateTransition from './state_transition';
import AfterStateTransition from './after_state_transition';
import StateEvent from './state_event';
import Utils from './utils';

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
    transitions: [],
    afterTransitions: [],
  }
};

const DEFAULT_CONFIG = {
  initialState: undefined,
  initialStateData: undefined,
  transitions: [],
  afterTransitions: [],
  actions: [],
};

class FsmCore {
  constructor() {
    this.assignDefaultProps();
  }

  initialize() {
    let state = this.getConfig('initialState');
    let stateData = this.getConfig('initialStateData');
    let transitions = this.getConfig('transitions');
    let afterTransitions = this.getConfig('afterTransitions');

    this.transitionTo(state, stateData);
    
    transitions.forEach((transition) => {
      this.updateTransitionMap(transition);
    });

    afterTransitions.forEach((transition) => {
      this.updateAfterTransitionMap(transition);
    });

    this._initialized = true;
  }

  isInitialized() {
    return this._initialized;
  }

  configure(config) {
    config = Object.assign({}, DEFAULT_CONFIG, config);

    let state = config.initialState;
    let stateData = config.initialStateData;
    let transitions = config.transitions || [];
    let afterTransitions = config.afterTransitions || [];
    let actions = config.actions || [];

    this.startWith(state, stateData);

    transitions.forEach((transition) => {
      this.registerTransition(transition);
    });

    afterTransitions.forEach((transition) => {
      this.registerAfterTransition(transition);
    });

    actions.forEach((action) => {
      this.registerAction(action);
    });
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
   * @return {StateTransition}
   */
  when(state, stateData) {
    let transition = new StateTransition();
    this.registerTransition(transition);
    return transition.when(state, stateData);
  }

  /**
   * @param  {Any} state
   * @return {AfterStateTransition}
   */
  afterTransitionFrom(state) {
    let transition = new AfterStateTransition();
    this.registerAfterTransition(transition);
    return transition.from(state);
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
    Utils.assertType(transition, StateTransition);
    let transitions = this.getConfig('transitions');
    transitions.push(transition);
  }

  /**
   * @param  {StateTransition} transition
   */
  registerAfterTransition(transition) {
    Utils.assertType(transition, AfterStateTransition);
    let transitions = this.getConfig('afterTransitions');
    transitions.push(transition);
  }

  /**
   * @param  {StateAction} action
   */
  registerAction(action) {
    Utils.assertType(action, StateAction);
    let store = this.getActionStore();
    store[action.name] = action.fn;
  }

  /**
   * @param  {String}   name
   * @param  {Function} fn
   */
  registerActionPayload(name, fn) {
    let action = new StateAction(name, fn);
    this.registerAction(action);
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
    Utils.assertType(stateData, StateData);
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

    transition.when('any', 'any').receive('any').stay().using(() => {
      console.debug(`Unhandled transition: ${state} [ ${stateData} ] - Received ${event}`);
    });

    return transition;
  }

  getUnhandledAfterTransition(state, targetState) {
    let transition = new AfterStateTransition();

    transition.from('any').to('any').do(() => {
      console.debug(`Unhandled after transition: ${state} to ${targetState}`);
    });
    return transition;
  }

  startWith(state, stateData) {
    this._config.initialState = state;
    this._config.initialStateData = stateData;
  }

  /**
   * Respond to the received event. Based on the current state and current stateData,
   * it decides the next state and next stateData.
   * @param  {Any} event
   */
  receive(event) {
    Utils.assert('State machine must be initialized first', this.isInitialized());

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

  /**
   * @param  {StateTransition} transition
   */
  updateTransitionMap(transition) {
    let keys = transition.getKeys();
    let json = this.getTransitionMap();
    Utils.deepUpdateJson(json, keys, transition);
  }

  /**
   * @param  {AfterStateTransition} transition
   */
  updateAfterTransitionMap(transition) {
    let keys = transition.getKeys();
    let json = this.getAfterTransitionMap();
    Utils.deepUpdateJson(json, keys, transition);
  }
}

export default FsmCore;
