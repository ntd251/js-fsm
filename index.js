import State from './lib/state';
import StateData from './lib/state_data';
import StateEvent from './lib/state_event';
import StateMachine from './lib/state_machine';
import FsmCore from './lib/fsm_core';

window.FSM = {
  StateMachine: StateMachine,
  State: State,
  StateData: StateData,
  StateEvent: StateEvent,
  Core: FsmCore,
};
