import StateTransition from './state_transition';
import AfterStateTransition from './after_state_transition';
import Utils from './utils';

class DslExtractorBase {
  /**
   * To be override
   */
  extract(config) {
    Utils.notImplemented('extract');

    let output = {
      initialState: undefined,
      initialStateData: undefined,
      transitions: undefined,
      afterTransitions: undefined,
      actions: undefined,
    };

    return output;
  }

  extractAndValidate(config) {
    let output = this.extract(config);
    this.validate(output);
    return output;
  }

  validate(output) {
    Utils.assert('Initial State required', output.initialState);
    Utils.assert('Initial State Data required', output.initialStateData);

    output.transitions.forEach((transition) => {
      Utils.assertType(transition, StateTransition);
    });
    
    output.afterTransitions.forEach((transition) => {
      Utils.assertType(transition, AfterStateTransition);
    });

    output.actions.forEach((action) => {
      Utils.assertType(action.name, String);
      Utils.assertType(action.fn, Function);
    });
  }
}

export default DslExtractorBase;
