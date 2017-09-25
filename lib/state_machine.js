import FsmCore from './fsm_core';
import DslExtractor from './dsl_extractor';

const DEFAULT_OPTIONS = {
  extractor: DslExtractor,
};

let StateMachine = function(config, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  let extractor = new options.extractor();
  let extractedConfig = extractor.extractAndValidate(config);

  let fsm = new FsmCore();
  fsm.configure(extractedConfig);

  let publicApi = {
    initialize: () => fsm.initialize(),
    getState: () => fsm.getState(),
    getStateData: () => fsm.getStateData(),
    receive: (event) => fsm.receive(event),
  };

  Object.assign(this, publicApi);
};

export default StateMachine;
