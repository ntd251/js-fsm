import StateTransition from './state_transition';
import AfterStateTransition from './after_state_transition';

const DEFAULT_PROPS = {
  _state: undefined,
  _stateData: undefined,
  _initialized: false,
  _actionStore: {},
  _transitionMap: {},
  _afterTransitionMap: {},
  _config: {
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
    this.generateTransitionMap();
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

  getStates() {
    return this.getConfig('states');
  }

  getStateDataValues() {
    return this.getConfig('stateDataValues');
  }

  getTransitionMap() {
    return this._transitionMap;
  }

  getAfterTransitionMap() {
    return this._afterTransitionMap;
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

  registerTransition(state, stateData, event, targetState, using) {
    let transition = new StateTransition();

    transition.when(state, stateData)
              .receive(event)
              .goto(targetState)
              .using(using);

    this.updateTransitionMap(transition);
  }

  registerAfterTransition(state, targetState, action) {
    let transition = new AfterStateTransition();

    transition.from(state)
              .to(targetState)
              .do(action);

    this.updateAfterTransitionMap(transition);
  }

  registerAction(name, fn) {
    _actionStore[name] = fn;
  }

  /**
   * @param  {String} name [description]
   * @return {Function}
   */
  getAction(name) {
    return _actionStore[name];
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
        return this.executeUsing(using, event);
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
    let stateData = usingFn(event) || stateData;
    this.validateStateData(stateData);
    return stateData;
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
    let stateTransitionMap = transitionMap[state][stateData];
    let transition = stateTransitionMap[event] ||
                     stateTransitionMap[event.constructor];

    return transition || this.getUnhandledTransition();
  }

  getUnhandledTransition() {

  }

  /**
   * Respond to the received event. Based on the current state and current stateData,
   * it decides the next state and next stateData.
   * @param  {Any} event
   */
  receive(event) {
    let state = this.getState();
    let transition = this.getTransition(event);
    let usingName = transition.using;
    let stay = transition.stay;
    let targetState = stay ? state : transition.goto;
    let using = transition.using;

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
    if (!stay) {
      let afterTransition = this.getAfterTransition(state, targetState);
      afterTransition();
    }
  }

  transitionTo(state, stateData) {
    _state = state;
    _stateData = stateData;
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
