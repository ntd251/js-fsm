import State from './state';
import StateData from './state_data';

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

FSM.State = State;
FSM.StateData = StateData;

export default FSM;
