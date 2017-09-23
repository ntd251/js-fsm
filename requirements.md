# Requirements

- Single threaded
- Finite number of states
- Finite number of state data
- Not allow to modify config in runtime
- Event type:
  - class - constructor matching
  - class instance - exact matching
- State Event
  - instance of FSM.StateData
- Using
  - method name
  - method
  - preferrably return state data


# Best Practices

- `action` and `using` should not refer to `state` and `stateData` value
- `using` is recommended to return `StateData`