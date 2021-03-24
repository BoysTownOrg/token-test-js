export const Color = Object.freeze({
  red: 1,
  yellow: 2,
  green: 3,
  white: 4,
  blue: 5,
  black: 6,
  unknown: 7,
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
  unknown: 4,
});

function tokensAreEquivalent(a, b) {
  return a.color === b.color && a.shape === b.shape;
}

function sizedTokensAreEquivalent(a, b) {
  return a.size === b.size && tokensAreEquivalent(a, b);
}

function singleTokenInteractionsAreEquivalent(a, b) {
  return a.action === b.action && tokensAreEquivalent(a.token, b.token);
}

function matchesSingleTokenInteraction(a, b) {
  return a.matchesSingleTokenInteraction(b);
}

function matchesDualTokenInteraction(a, b) {
  return a.matchesDualTokenInteraction(b);
}

function singleSizedTokenInteractionsAreEquivalent(a, b) {
  return a.action === b.action && sizedTokensAreEquivalent(a.token, b.token);
}

function dualTokenInteractionsHaveEquivalentActionsAndCompare(
  a,
  b,
  comparator
) {
  return (
    a.action === b.action &&
    comparator(a.firstToken, b.firstToken) &&
    comparator(a.secondToken, b.secondToken)
  );
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

export class InOrder {
  constructor(rules) {
    this.rules = Array.isArray(rules) ? rules : [rules];
    this.broken = false;
  }

  satisfied() {
    return !this.broken && this.rules.every((rule) => rule.satisfied());
  }

  submitSingleTokenInteraction(interaction) {
    const unsatisfiedRule = this.rules.find((rule) => !rule.satisfied());
    if (typeof unsatisfiedRule === "undefined") this.broken = true;
    else unsatisfiedRule.submitSingleTokenInteraction(interaction);
  }

  submitDualTokenInteraction(interaction) {
    const unsatisfiedRule = this.rules.find((rule) => !rule.satisfied());
    if (typeof unsatisfiedRule === "undefined") this.broken = true;
    else unsatisfiedRule.submitDualTokenInteraction(interaction);
  }

  determined() {
    return this.broken || this.rules.every((rule) => rule.determined());
  }
}

export class InAnyOrder {
  constructor(interactions) {
    this.interactions = Array.isArray(interactions)
      ? interactions
      : [interactions];
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

export class TokenInteraction {
  constructor(interaction) {
    this.interaction = interaction;
    this.determined_ = false;
    this.satisfied_ = false;
  }

  matchesSingleTokenInteraction(interaction) {
    return singleTokenInteractionsAreEquivalent(this.interaction, interaction);
  }

  matchesDualTokenInteraction(interaction) {
    return dualTokenInteractionsAreEquivalent(this.interaction, interaction);
  }

  submitSingleTokenInteraction(interaction) {
    this.satisfied_ =
      !this.determined_ &&
      singleTokenInteractionsAreEquivalent(this.interaction, interaction);
    this.determined_ = true;
  }

  submitDualTokenInteraction(interaction) {
    this.satisfied_ =
      !this.determined_ &&
      dualTokenInteractionsAreEquivalent(this.interaction, interaction);
    this.determined_ = true;
  }

  determined() {
    return this.determined_;
  }

  satisfied() {
    return this.satisfied_;
  }
}

export class SizedTokenInteraction {
  constructor(interaction) {
    this.interaction = interaction;
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
}

export class TokenModel {
  constructor(trial, timer, rule) {
    this.trial = trial;
    this.timer = timer;
    this.rule = rule;
    this.submittedInteractions = [];
  }

  submitSingleTokenInteraction(interaction) {
    this.submittedInteractions.push({
      ...interaction,
      milliseconds: this.timer.milliseconds(),
    });
    this.rule.submitSingleTokenInteraction(interaction);
  }

  submitDualTokenInteraction(interaction) {
    this.submittedInteractions.push({
      ...interaction,
      milliseconds: this.timer.milliseconds(),
    });
    this.rule.submitDualTokenInteraction(interaction);
  }

  concludeTrial() {
    this.trial.conclude({
      correct: this.rule.satisfied(),
      tokenInteractions: this.submittedInteractions,
    });
  }
}
