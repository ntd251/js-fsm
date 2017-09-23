import StateTransition from './state_transition';

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
    let transitionMap = this.getTransitionMap();

    let transition = new StateTransition();

    transition.when(state, stateData)
              .receive(event)
              .goto(targetState)
              .using(using);

    let json = transition.toJSON();
    
  }

  registerAfterTransition(state, targetState, action) {

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
    let defaultProps = {
      _state: undefined,
      _stateData: undefined,
      _initialized: false,
      _actionStore: {},
      _config: {
        states: [],
        stateDataValues: [],
        usings: [],
        dos: [],
        transitions: [],
        events: [],
      }
    };
    
    Object.assign(this, defaultProps);
  }

  getTransition(event) {
    let state = this.getState();
    let stateData = this.getStateData();
    let transitionMap = this.getTransitionMap();
    let stateTransitions = transitionMap[state][stateData];
    let transition = stateTransitions.find((t) => {
      return t.event === event ||
             t.event === event.constructor;
    });

    return transition || this.getUnhandledTransition();
  }

  getStateTransitionsMap() {

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
}

export default FsmCore;
