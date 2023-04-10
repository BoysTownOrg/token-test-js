export const Color = Object.freeze({
  red: 1,
  yellow: 2,
  green: 3,
  white: 4,
  blue: 5,
  black: 6,
  brown: 7,
  orange: 8,
  unknown: 9,
});

export const Shape = Object.freeze({
  square: 1,
  circle: 2,
  unknown: 3,
});

export const Size = Object.freeze({
  small: 1,
  large: 2,
  unknown: 3,
});

export const Action = Object.freeze({
  touch: 1,
  pickUp: 2,
  useToTouch: 3,
  move: 4,
  moveAwayFrom: 5,
  putLeftOf: 6,
  putBetween: 7,
  unknown: 8,
});

export function hashToken(token) {
  return Object.keys(Color).length * (token.shape - 1) + token.color - 1;
}

export function hashSizedToken(token) {
  return (
    Object.keys(Color).length * Object.keys(Shape).length * (token.size - 1) +
    Object.keys(Color).length * (token.shape - 1) +
    token.color -
    1
  );
}

function tokensAreEquivalent(a, b) {
  return a.color === b.color && a.shape === b.shape;
}

function sizedTokensAreEquivalent(a, b) {
  return a.size === b.size && tokensAreEquivalent(a, b);
}

function tokenInteractionsAreEquivalent(a, b, comparator) {
  return a.action === b.action && comparator(a, b);
}

function tokenInteractionsAreSufficientlyEquivalent(
  expected,
  actual,
  comparator
) {
  return (
    (expected.action === Action.touch
      ? actual.action === Action.touch ||
        actual.action === Action.move ||
        actual.action === Action.pickUp
      : expected.action === actual.action) && comparator(expected, actual)
  );
}

function singleTokenInteractionsAreEquivalentBy(comparator, a, b) {
  return tokenInteractionsAreEquivalent(a, b, (c, d) =>
    comparator(c.token, d.token)
  );
}

function dualTokenInteractionsHaveEquivalentActionsAndCompare(
  a,
  b,
  comparator
) {
  return tokenInteractionsAreEquivalent(
    a,
    b,
    (c, d) =>
      comparator(c.firstToken, d.firstToken) &&
      comparator(c.secondToken, d.secondToken)
  );
}

function singleSizedTokenInteractionsAreEquivalent(a, b) {
  return singleTokenInteractionsAreEquivalentBy(sizedTokensAreEquivalent, a, b);
}

function dualTokenInteractionsAreEquivalent(a, b) {
  return dualTokenInteractionsHaveEquivalentActionsAndCompare(
    a,
    b,
    tokensAreEquivalent
  );
}

function dualSizedTokenInteractionsAreEquivalent(a, b) {
  return dualTokenInteractionsHaveEquivalentActionsAndCompare(
    a,
    b,
    sizedTokensAreEquivalent
  );
}

function matchesSingleTokenInteraction(a, b) {
  return a.matchesSingleTokenInteraction(b);
}

function matchesDualTokenInteraction(a, b) {
  return a.matchesDualTokenInteraction(b);
}

function containsTokenInteraction(collection, tokenInteraction, comparator) {
  return (
    collection.findIndex((interaction) =>
      comparator(interaction, tokenInteraction)
    ) !== -1
  );
}

function removeTokenInteraction(collection, tokenInteraction, comparator) {
  collection.splice(
    collection.findIndex((interaction) =>
      comparator(interaction, tokenInteraction)
    ),
    1
  );
}

function submitTokenInteractionInAnyOrder(rule, interaction, comparator) {
  if (rule.determined()) rule.correct = false;
  else if (
    containsTokenInteraction(rule.interactions, interaction, comparator)
  ) {
    removeTokenInteraction(rule.interactions, interaction, comparator);
    if (rule.interactions.length === 0) {
      rule.correct = true;
      rule.done = true;
    }
  } else rule.done = true;
}

function submitSingleTokenInteraction(rule, interaction) {
  rule.submitSingleTokenInteraction(interaction);
}

function submitDualTokenInteraction(rule, interaction) {
  rule.submitDualTokenInteraction(interaction);
}

function submitTokenInteractionInOrder(inOrder, interaction, submit) {
  const unsatisfiedRule = inOrder.rules.find((rule) => !rule.satisfied());
  if (typeof unsatisfiedRule === "undefined") inOrder.broken = true;
  else submit(unsatisfiedRule, interaction);
}

export class DoNothing {
  constructor() {
    this.satisfied_ = true;
  }

  satisfied() {
    return this.satisfied_;
  }

  submitSingleTokenInteraction() {
    this.satisfied_ = false;
  }

  submitDualTokenInteraction() {
    this.satisfied_ = false;
  }

  determined() {
    return true;
  }
}

export class InOrder {
  constructor(rules) {
    this.rules = rules;
    this.broken = false;
  }

  satisfied() {
    return !this.broken && this.rules.every((rule) => rule.satisfied());
  }

  submitSingleTokenInteraction(interaction) {
    submitTokenInteractionInOrder(
      this,
      interaction,
      submitSingleTokenInteraction
    );
  }

  submitDualTokenInteraction(interaction) {
    submitTokenInteractionInOrder(
      this,
      interaction,
      submitDualTokenInteraction
    );
  }

  determined() {
    return this.broken || this.rules.every((rule) => rule.determined());
  }
}

export class InAnyOrder {
  constructor(interactions) {
    this.interactions = interactions;
    this.correct = false;
    this.done = false;
  }

  satisfied() {
    return this.correct;
  }

  submitSingleTokenInteraction(interaction) {
    submitTokenInteractionInAnyOrder(
      this,
      interaction,
      matchesSingleTokenInteraction
    );
  }

  submitDualTokenInteraction(interaction) {
    submitTokenInteractionInAnyOrder(
      this,
      interaction,
      matchesDualTokenInteraction
    );
  }

  determined() {
    return this.done;
  }
}

function submitTokenInteractionForFirstOrSecond(rule, interaction, comparator) {
  rule.satisfied_ =
    !rule.determined_ &&
    (comparator(rule.first, interaction) ||
      comparator(rule.second, interaction));
  rule.determined_ = true;
}

export class FirstOrSecond {
  constructor(first, second) {
    this.first = first;
    this.second = second;
    this.determined_ = false;
    this.satisfied_ = false;
  }

  satisfied() {
    return this.satisfied_;
  }

  submitSingleTokenInteraction(interaction) {
    submitTokenInteractionForFirstOrSecond(
      this,
      interaction,
      matchesSingleTokenInteraction
    );
  }

  submitDualTokenInteraction(interaction) {
    submitTokenInteractionForFirstOrSecond(
      this,
      interaction,
      matchesDualTokenInteraction
    );
  }

  determined() {
    return this.determined_;
  }
}

function movesTokenAwayFrom(tokenRelation, actualToken, expectedInteraction) {
  return (
    tokensAreEquivalent(actualToken, expectedInteraction.firstToken) &&
    tokenRelation.movedTokenIsFurtherFrom(expectedInteraction.secondToken)
  );
}

function putsTokenBetween(tokenRelation, actualToken, expectedInteraction) {
  return (
    tokensAreEquivalent(actualToken, expectedInteraction.firstToken) &&
    tokenRelation.movedTokenIsBetween(
      expectedInteraction.secondToken,
      expectedInteraction.thirdToken
    )
  );
}

function putsTokenLeftOf(tokenRelation, actualToken, expectedInteraction) {
  return (
    tokensAreEquivalent(actualToken, expectedInteraction.firstToken) &&
    tokenRelation.movedTokenIsLeftOf(expectedInteraction.secondToken)
  );
}

function mayMoveTokenAwayFrom(actualInteraction, expectedInteraction) {
  return (
    expectedInteraction.action === Action.moveAwayFrom &&
    (actualInteraction.action === Action.move ||
      actualInteraction.action === Action.pickUp)
  );
}

function mayPutTokenBetween(actualInteraction, expectedInteraction) {
  return (
    expectedInteraction.action === Action.putBetween &&
    actualInteraction.action === Action.move
  );
}

function mayPutTokenLeftOf(actualInteraction, expectedInteraction) {
  return (
    expectedInteraction.action === Action.putLeftOf &&
    actualInteraction.action === Action.move
  );
}

function singleTokenInteractionsAreSufficientlyEquivalent(expected, actual) {
  return tokenInteractionsAreSufficientlyEquivalent(expected, actual, (c, d) =>
    tokensAreEquivalent(c.token, d.token)
  );
}

export class TokenInteraction {
  constructor(interaction) {
    this.interaction = interaction;
    this.determined_ = false;
    this.satisfied_ = false;
  }

  matchesSingleTokenInteraction(interaction) {
    return singleTokenInteractionsAreSufficientlyEquivalent(
      this.interaction,
      interaction
    );
  }

  matchesDualTokenInteraction(interaction) {
    return this.interaction.action === Action.touch &&
      interaction.action === Action.useToTouch
      ? tokensAreEquivalent(interaction.firstToken, this.interaction.token)
      : dualTokenInteractionsAreEquivalent(this.interaction, interaction);
  }

  submitSingleTokenInteraction(interaction, tokenRelation) {
    this.satisfied_ =
      !this.determined_ &&
      (mayMoveTokenAwayFrom(interaction, this.interaction)
        ? movesTokenAwayFrom(tokenRelation, interaction.token, this.interaction)
        : mayPutTokenBetween(interaction, this.interaction)
        ? putsTokenBetween(tokenRelation, interaction.token, this.interaction)
        : mayPutTokenLeftOf(interaction, this.interaction)
        ? putsTokenLeftOf(tokenRelation, interaction.token, this.interaction)
        : singleTokenInteractionsAreSufficientlyEquivalent(
            this.interaction,
            interaction
          ));
    this.determined_ = true;
  }

  submitDualTokenInteraction(interaction, tokenRelation) {
    this.satisfied_ =
      !this.determined_ &&
      (this.interaction.action === Action.moveAwayFrom
        ? movesTokenAwayFrom(
            tokenRelation,
            interaction.firstToken,
            this.interaction
          )
        : this.interaction.action === Action.putBetween
        ? putsTokenBetween(
            tokenRelation,
            interaction.firstToken,
            this.interaction
          )
        : this.interaction.action === Action.putLeftOf
        ? putsTokenLeftOf(
            tokenRelation,
            interaction.firstToken,
            this.interaction
          )
        : this.interaction.action === Action.touch &&
          interaction.action === Action.useToTouch
        ? tokensAreEquivalent(interaction.firstToken, this.interaction.token)
        : dualTokenInteractionsAreEquivalent(this.interaction, interaction));
    this.determined_ = true;
  }

  determined() {
    return this.determined_;
  }

  satisfied() {
    return this.satisfied_;
  }
}

function submitSizedTokenInteraction(rule, interaction, comparator) {
  rule.satisfied_ =
    !rule.determined_ && comparator(rule.interaction, interaction);
  rule.determined_ = true;
}

export class SizedTokenInteraction {
  constructor(interaction) {
    this.interaction = interaction;
    this.determined_ = false;
    this.satisfied_ = false;
  }

  matchesSingleTokenInteraction(interaction) {
    return singleSizedTokenInteractionsAreEquivalent(
      this.interaction,
      interaction
    );
  }

  matchesDualTokenInteraction(interaction) {
    return dualSizedTokenInteractionsAreEquivalent(
      this.interaction,
      interaction
    );
  }

  submitSingleTokenInteraction(interaction) {
    submitSizedTokenInteraction(
      this,
      interaction,
      singleSizedTokenInteractionsAreEquivalent
    );
  }

  submitDualTokenInteraction(interaction) {
    submitSizedTokenInteraction(
      this,
      interaction,
      dualSizedTokenInteractionsAreEquivalent
    );
  }

  determined() {
    return this.determined_;
  }

  satisfied() {
    return this.satisfied_;
  }
}

function submitTokenInteraction(model, interaction, tokenRelation, submit) {
  model.submittedInteractions.push({
    ...interaction,
    milliseconds: model.timer.milliseconds(),
  });
  submit(model.rule, interaction, tokenRelation);
}

function submitSingleTokenInteractionWithRelation(
  rule,
  interaction,
  tokenRelation
) {
  rule.submitSingleTokenInteraction(interaction, tokenRelation);
}

function submitDualTokenInteractionWithRelation(
  rule,
  interaction,
  tokenRelation
) {
  rule.submitDualTokenInteraction(interaction, tokenRelation);
}

function colorName(token) {
  switch (token) {
    case Color.black:
      return "black";
    case Color.blue:
      return "blue";
    case Color.brown:
      return "brown";
    case Color.green:
      return "green";
    case Color.orange:
      return "orange";
    case Color.red:
      return "red";
    case Color.white:
      return "white";
    case Color.yellow:
      return "yellow";
    default:
      return "?";
  }
}

function shapeName(shape) {
  switch (shape) {
    case Shape.circle:
      return "circle";
    case Shape.square:
      return "square";
    default:
      return "?";
  }
}

function sizeName(size) {
  switch (size) {
    case Size.large:
      return "large";
    case Size.small:
      return "small";
    default:
      return "?";
  }
}

function actionName(action) {
  switch (action) {
    case Action.move:
      return "move";
    case Action.moveAwayFrom:
      return "move away from";
    case Action.pickUp:
      return "pick up";
    case Action.putBetween:
      return "put between";
    case Action.putLeftOf:
      return "put left of";
    case Action.touch:
      return "touch";
    case Action.useToTouch:
      return "use to touch";
    default:
      return "?";
  }
}

function formatToken(token) {
  token.color = colorName(token.color);
  token.shape = shapeName(token.shape);
  if (Object.prototype.hasOwnProperty.call(token, "size"))
    token.size = sizeName(token.size);
  return token;
}

function formatTokenInteractions(tokenInteractions) {
  return tokenInteractions.map((interaction) => {
    Object.keys(interaction).forEach((key) => {
      switch (key) {
        case "action":
          interaction[key] = actionName(interaction[key]);
          break;
        case "token":
        case "firstToken":
        case "secondToken":
          interaction[key] = formatToken(interaction[key]);
          break;
        default:
          break;
      }
    });
    return interaction;
  });
}

export class TokenModel {
  constructor(trial, timer, rule) {
    this.trial = trial;
    this.timer = timer;
    this.rule = rule;
    this.submittedInteractions = [];
  }

  submitSingleTokenInteraction(interaction, tokenRelation) {
    submitTokenInteraction(
      this,
      interaction,
      tokenRelation,
      submitSingleTokenInteractionWithRelation
    );
  }

  submitDualTokenInteraction(interaction, tokenRelation) {
    submitTokenInteraction(
      this,
      interaction,
      tokenRelation,
      submitDualTokenInteractionWithRelation
    );
  }

  concludeTrial() {
    this.trial.conclude({
      correct: this.rule.satisfied(),
      tokenInteractions: formatTokenInteractions(this.submittedInteractions),
    });
  }
}
