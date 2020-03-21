// Tokens followed by quantifier e.g. a* = a any number of times
// Bars are conditional
// Parenthasis group
// Period is a wild card e.g. a.b any string starting with a and ending with b

const quantifiers = ["*", "?", "+"];

function Link(stateOne, stateTwo, legalCharacters) {
  this.stateOne = stateOne;
  this.stateTwo = stateTwo;

  this.legalCharactors = legalCharacters;
}

Link.prototype = {
  constructor: Link,
}

function State(isStartState, isFinalState) {
  this.isStartState = isStartState;
  this.isFinalState = isFinalState;
}

State.prototype = {
  constructor: State,
}

function Fsm(regex) {
  // State objects
  this.states = [];

  // Tuples of two states and a condition
  this.links = [];

  const startState = State(true, false);
  this.states.push(startState);

  var constructed = false;
  while(!constructed) {
    const charactor = regex[0];
    const quantifier = regex[1];

    const hasQuantifier = quantifiers.indexOf(quantifier) >= 0;

    regex.shift();
    if(hasQuantifier) {
      regex.shift();
    }

    if(regex.length == 0) {
      constructed = true;
    }
  }
}

Fsm.prototype = {
  constructor: Fsm,

  check: function(string) {
    return false;
  }
}


function run(regex) {
  regexArray = regex.split();
  finiteStateMachine = new Fsm(regexArray);

  valid = finiteStateMachine.check('aab');
  console.log(valid);
}

run('a*b');
