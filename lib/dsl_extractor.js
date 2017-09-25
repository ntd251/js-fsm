import DslExtractorBase from './dsl_extractor_base';
import StateTransition from './state_transition';
import AfterStateTransition from './after_state_transition';
import Utils from './utils';

class DslExtractor extends DslExtractorBase {
  extract(config) {
    let condition = this.extractInitialCondition();

    return {
      initialState: condition.state,
      initialStateData: condition.stateData,
      transitions: this.extractTransitions(config),
      afterTransitions: this.extractTransitions(config),
    };
  }

  extractInitialCondition(config) {
    return config.startWith || {};
  }

  /**
   * @param  {Hash} config
   * @return {StateTransition[]}
   */
  extractTransitions(config) {
    let stateMap = config.when || {};
    let states = Object.keys(stateMap);
    let transitions = [];

    states.forEach((state) => {
      let stateDataMap = stateMap[state];
      let stateDataValues = Object.keys(stateDataMap);

      stateDataValues.forEach((stateData) => {
        let eventConfig = stateDataMap[stateData];
        let transition = new StateTransition();

        transition.when(state, stateData)
                  .receive(eventConfig.event);

        if (eventConfig.stay) {
          transition.stay();
        } else {
          transition.goto(eventConfig.goto);
        }

        transition.using(eventConfig.using);

        transitions.push(transition);
      });
    });

    return transitions;
  }

  /**
   * @param  {Hash} config
   * @return {AfterStateTransition[]}
   */
  extractAfterTransitions(config) {
    let jsonTransitions = config.afterTransition || [];

    return jsonTransitions.forEach((json) => {
      let transition = new AfterStateTransition();

      transition.from(json.from)
                .to(json.to)
                .do(json.do);

      return transition;
    });
  }
}
