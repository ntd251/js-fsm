import FsmCore from './fsm_core';

let StateMachine = function(config) {
  let fsm = new FsmCore(config);

  let publicApi = {
    initialize: () => fsm.initialize(),
    getState: () => fsm.getState(),
    getStateData: () => fsm.getStateData(),
    receive: (event) => fsm.receive(event),
  };

  Object.assign(this, publicApi);
};

export default StateMachine;
