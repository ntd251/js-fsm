import Utils from './utils';

class StateAction {
  constructor(name, fn) {
    Utils.assertType(name, String);
    Utils.assertType(fn, Function);

    Object.assign({
      name,
      fn,
    });
  }
}

export default StateAction;
