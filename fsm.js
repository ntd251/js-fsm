"use strict";

// Reserved keywords
// - else
// 

class StateData {}

let FSM = function(config) {
  let fsm = new FsmCore(config);

  let publicApi = {
    initialize: () => fsm.initialize(),
    getState: () => fsm.getState(),
    getStateData: () => fsm.getStateData(),
    receive: (event) => fsm.receive(event),
  };

  Object.assign(this, publicApi);
};

class FsmCore {
  constructor(config) {
    this.assignDefaultProps();
    this.extractConfig();
    this.validateConfig();
  },

  initialize() {

  },

  getState() {
    return this._state;
  },

  getStateData() {
    return this._stateData;
  },

  /**
   * PRIVATE
   */

  extractConfig() {
    // extract states
    // extract stateData
    // extract usings
    // extract transitions
    // extract afterTransitions
    // extract events (might not necessary)
    // extract 
  },

  validateConfig() {
    // validate using's existence
    // validate using's return payload
    // validate transition do's existence
    // validate stateData to be instance of FSM.StateData
    // validate events not to be function
  },

  getMethodDefinition(methodName) {
    _actionStore[methodName];
  },

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
  },

  /**
   * Execute `using` function with the target event
   * @param  {String} fnName
   * @param  {Any} event
   * @return {StateData} StateData
   */
  executeUsingByName(fnName, event) {
    let usingFn = this.getMethodDefinition(fnName);
    return this.executeUsingByFunction(usingFn, event);
  },

  /**
   * Execute `using` function with the target event
   * @param  {Function} usingFn
   * @param  {Any} event
   * @return {StateData} StateData
   */
  executeUsingByFunction(usingFn, event) {
    let stateData = this.getStateData();
    let stateData = usingFn(event) || stateData;
    this.validateStateData(stateData);
    return stateData;
  },

  assignDefaultProps() {
    let defaultProps = {
      _state: undefined,
      _stateData: undefined,

      // config
      _states: [],
      _stateData: [],
      _usings: [],
      _dos: [],
      _transitions: [],
      _events: [],
    };
    
    Object.assign(this, defaultProps);
  },

  getTransition(event) {
    let state = this.getState();
    let stateData = this.getStateData();
    let stateTransitionsMap = this.getStateTransitionsMap();
    let stateTransitions = stateTransitionsMap[state][stateData];
    let transition = stateTransitions.find((t) => {
      return t.event === event ||
             t.event === event.constructor;
    });

    return transition || this.getUnhandledTransition();
  },

  getStateTransitionsMap() {

  },

  getUnhandledTransition() {

  },

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
  },

  transitionTo(state, stateData) {
    _state = state;
    _stateData = stateData;
  },

  validateStateData(stateData) {

  },
}
