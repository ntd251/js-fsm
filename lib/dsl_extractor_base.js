import State from './state';
import StateData from './state_data';
import StateTransition from './state_transition';
import AfterStateTransition from './after_state_transition';
import StateAction from './state_action';
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
    let state = output.initialState;
    let stateData = output.initialStateData;
    let transitions = output.transitions || [];
    let afterTransitions = output.afterTransitions || [];
    let actions = output.actions || [];

    Utils.assert('Initial State required', state);
    Utils.assert('Initial State Data required', stateData);

    Utils.assertType(state, State);
    Utils.assertType(stateData, StateData);

    output.transitions.forEach((transition) => {
      Utils.assertType(transition, StateTransition);
    });
    
    output.afterTransitions.forEach((transition) => {
      Utils.assertType(transition, AfterStateTransition);
    });

    output.actions.forEach((action) => {
      Utils.assertType(action, StateAction);
    });
  }
}

export default DslExtractorBase;
