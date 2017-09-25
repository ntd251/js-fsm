# JS-Finite State Machine

`description to be updated`

Provide state machine capability for JavaScript with friendly DSL

## Notes

This is a **work-in-progress** and not ready for testing.

## Usages

### Using JSON DSL

```js
let config = {
  startWith: {
    state: 'stopped',
    stateData: 'has_fuel'
  },
  when: {
    stopped: {
      has_fuel: [
        {
          event: 'start',
          goto: 'running',
          using: 'startEngine'
        }
      ],
      no_fuel: [
        {
          event: 'start',
          stay: true
        }
      ]
    },
    started: {
      any: [
        {
          event: 'stop',
          goto: 'stopped'
        }
      ]
    }
  },
  afterTransition: [
    {
      from: 'stopped',
      to: 'running',
      do: 'playMusic'
    }
  ]
};
```

### Using JavaScript DSL

```js
let fsm = new StateMachine();

fsm.startWith('stopped', 'hasFuel');

fsm.transitionFrom('stopped', 'hasFuel')
   .receive('start')
   .goto('started')
   .using('startEngine');

fsm.transitionFrom('started', 'any')
   .receive('stop')
   .goto('stopped');

fsm.afterTransitionFrom('stopped')
   .to('started')
   .do(() => { console.log('RUNNING') });

fsm.afterTransitionFrom('started')
   .to('stopped')
   .do(() => { console.log('STOPPED') });

fsm.registerAction('startEngine', () => console.log('Starting Engine'));

fsm.initialize();

fsm.receive('start');
fsm.receive('stop');
fsm.receive('releaseGas');
fsm.receive('start');
```

## Features

### Finite State Machine
  - Each state machine is single-threaded
  - Finite number of states
  - Finite number of state data
  - Support state data
  - Actions during state transition
  - Actions after state transition
  - Not allow to modify config in runtime

### DSL
  - Friendly DSL
  - Extendable DSL extractor / parser

## Architecture

- `FSM Core`
- `DSL Extractor`
- `State`
- `StateData`
- `StateTransition`
- `AfterStateTransition`

## Data types

- State types
  - `State` class instance (recommended)
  - `String`
  - `any`, `_`, `undefined`, `else`

- State Data
  - instance of FSM.StateData
  - `any`, `_`, `undefined`, `else`

- Event types
  - class - constructor matching
  - class instance - exact matching

- `using`: action to perform during transition
  - method name
  - method
  - preferrably return state data

- `afterTransition`: action to perform after transition finishes

## Best Practices

- `action` and `using` should not refer to `state` and `stateData` value
- `using` is recommended to return `StateData`
