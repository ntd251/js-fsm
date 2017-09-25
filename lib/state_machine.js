import FsmCore from './fsm_core';
import DslExtractor from './dsl_extractor';

const DEFAULT_OPTIONS = {
  extractor: DslExtractor,
};

let StateMachine = function(config, options) {
  let fsm = new FsmCore();
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  let publicApi = {
    initialize: () => fsm.initialize(),
    configure: (config) => {
      let extractor = new options.extractor();
      let extractedConfig = extractor.extractAndValidate(config);
      fsm.configure(extractedConfig);
    },
    startWith: (state, stateData) => fsm.startWith(state, stateData),
    when: (state, stateData) => fsm.when(state, stateData),
    afterTransitionFrom: (state) => fsm.transitionFrom(state),
    registerAction: (name, fn) => fsm.registerAction(name, fn),
    getState: () => fsm.getState(),
    getStateData: () => fsm.getStateData(),
    receive: (event) => fsm.receive(event),
  };

  Object.assign(this, publicApi);
};

export default StateMachine;
