# JS-Finite State Machine

`description to be updated`

Provide state machine capability for JavaScript with friendly DSL

## Notes

This is a **work-in-progress** and not ready for testing.

## Features

- Single threaded
- Finite number of states
- Finite number of state data
- Not allow to modify config in runtime

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
