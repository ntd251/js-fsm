class DslExtractor {
  extract(config) {
    return {
      states: this.extractStates(config),
      stateDataValues: this.extractStateDataValues(config),
      usings: this.extractUsings(config),
      transitions: this.extractTransitions(config),
      afterTransitions: this.extractTransitions(config),
    };
  }

  validate() {
    // validate using's existence
    // validate using's return payload
    // validate transition do's existence
    // validate stateData to be instance of FSM.StateData
    // validate events not to be function
  }

  /**
   * Expected format
   * @param  {Hash} config - DSL
   * @return {[type]}        [description]
   */
  extractStates(config) {

  }

  extractStateDataValues(config) {

  }

  extractUsings(config) {

  }

  extractTransitions(config) {

  }

  extractAfterTransitions(config) {

  }
}
