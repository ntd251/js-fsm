class StateData {
  constructor(name) {
    this.name = name;
  }
}

const ANY = new StateData('Any');

StateData.Any = ANY;

StateData.AnyMatches = [
  undefined,
  '_',
  'any',
  'else',
];

/**
 * Convert AnyMatches to StateData.Any
 * @param  {Any} stateData
 * @return {StateData}
 */
StateData.normalize = function(stateData) {
  if (StateData.AnyMatches.includes(stateData)) {
    return StateData.Any;
  }
  
  if (stateData.constructor.name === 'StateData') {
    return stateData;
  }
};

export default StateData;
