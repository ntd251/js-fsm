class State {
  constructor(name) {
    this.name = name;
  }
}

const ANY = new State('Any');

State.Any = ANY;

State.AnyMatches = [
  undefined,
  '_',
  'any',
  'else',
];

/**
 * Convert AnyMatches to State.Any
 * @param  {Any} state
 * @return {State}
 */
State.normalize = function(state) {
  if (State.AnyMatches.includes(state)) {
    return State.Any;
  }

  switch(state.constructor.name) {
    case 'State':
      return state;

    case 'String':
      return new State(state);
  }
};

export default State;
