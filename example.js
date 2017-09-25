let addFuel = new AddFuel(100);

let payload = {
  startWith: {
    state: 'pending',
    stateData: 'HAS_FUEL',
  },
  when: {
    pending: [
      {
        event: 'START',
        stateData: 'HAS_FUEL',
        goto: 'started',
        using: 'startEngine',
        stateTimeout: 5000,
      }
    ],

    // Alternative
    pending: [
      {
        event: 'START',
        stateDataSwitch: {
          HAS_FUEL: {
            goto: 'started',
            using: 'startEngine',
          },
          else: {
            stay: true,
          }
        },
      },
      {
        event: AddFuel,
        stateData: 'any',
        stay: true,
        using: 'addFuel',
      }
    ],

    else: [

    ],
  },

  afterTransition: [
    { from: 'pending', to: 'started', do: 'speedUp', },
  ],

  stateTimeout: {
    pending: 1000,
  },

  actionStore: {
    startEngine: (event) => {
      let stateData = 'HasFuel';
      return stateData;
    },
  }
};

let fsm = new FSM(config);

fsm.updateActionStore({
  startEngine: (event) => {

  },
});

fsm.initialize();

fsm.getState(); // pending
fsm.gestStateData(); // HAS_FUEL

fsm.receive('start');
fsm.getState(); // started
fsm.getStateData(); // HAS_FUEL


let transitionMap = {
  started: {
    has_fuel: {
      speedUp: {
        stay: '',
        using: '',
        goto: '',
      },
    },

    else: {
      speedUp: {
        stay: '',
        using: '',
        goto: '',
      },
    },
  },
};



