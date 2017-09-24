import Utils from './utils';

class StateData {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
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

  switch(stateData.constructor.name) {
    case 'StateData':
      return stateData;

    case 'String':
      return new StateData(stateData);

    default:
      Utils.assert('Invalid definition for state data');
  }
};

export default StateData;
