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

// Examples - TODO: organize

window.fsm = new FSM.Core();

fsm.registerInitialState('stopped');
fsm.registerInitialStateData('hasFuel');

let transitions = [
  fsm.generateTransition('stopped', 'hasFuel').receive('start').goto('started').using('startEngine'),
  fsm.generateTransition('stopped', 'hasFuel').receive('releaseGas').stay().using('releaseGas'),
  fsm.generateTransition('stopped', 'noFuel').receive('pumpGas').stay().using('pumpGas'),
  fsm.generateTransition('stopped', 'noFuel').receive('start').stay().using('alertNoFuel'),
  fsm.generateTransition('started', 'any').receive('stop').goto('stopped'),
];

transitions.forEach((transition) => fsm.registerTransition(transition));

fsm.registerAction('startEngine', () => console.log('Starting Engine'));
fsm.registerAction('alertNoFuel', () => console.log('No Fuel, cant start'));
fsm.registerAction('pumpGas', (event) => new StateData('hasFuel'));
fsm.registerAction('releaseGas', (event) => new StateData('noFuel'));

fsm.initialize();

fsm.receive('start');
fsm.receive('stop');
fsm.receive('releaseGas');
fsm.receive('start');
