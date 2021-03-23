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

function concludeTrial(tokenModel, correct) {
  tokenModel.trial.conclude({
    correct,
    tokenInteractions: tokenModel.submittedInteractions,
  });
}

function submitTokenInteraction(tokenModel, interaction, comparator) {
  tokenModel.submittedInteractions.push({
    ...interaction,
    milliseconds: tokenModel.timer.milliseconds(),
  });
  if (tokenModel.interactionCollectionIndex === tokenModel.interactions.length)
    return;
  if (
    tokenModel.interactions[tokenModel.interactionCollectionIndex].length > 1
  ) {
    if (
      containsTokenInteraction(
        tokenModel.interactions[tokenModel.interactionCollectionIndex],
        interaction,
        comparator
      )
    ) {
      removeTokenInteraction(
        tokenModel.interactions[tokenModel.interactionCollectionIndex],
        interaction,
        comparator
      );
      if (
        tokenModel.interactions[tokenModel.interactionCollectionIndex]
          .length === 1
      )
        [
          tokenModel.interactions[tokenModel.interactionCollectionIndex],
        ] = tokenModel.interactions[tokenModel.interactionCollectionIndex];
    }
  } else if (
    comparator(
      tokenModel.interactions[tokenModel.interactionCollectionIndex],
      interaction
    )
  ) {
    tokenModel.interactionCollectionIndex += 1;
    if (
      tokenModel.interactionCollectionIndex === tokenModel.interactions.length
    )
      tokenModel.correct = true;
  }
}

export class TokenModel {
  constructor(trial, timer, interactions) {
    this.trial = trial;
    this.timer = timer;
    this.interactions = interactions;
    this.submittedInteractions = [];
    this.interactionCollectionIndex = 0;
    this.correct = false;
  }

  submitSingleTokenInteraction(interaction) {
    submitTokenInteraction(
      this,
      interaction,
      singleTokenInteractionsAreEquivalent
    );
  }

  submitDualTokenInteraction(interaction) {
    submitTokenInteraction(
      this,
      interaction,
      dualTokenInteractionsAreEquivalent
    );
  }

  concludeTrial() {
    concludeTrial(this, this.correct);
  }
}

export class SizedTokenModel {
  constructor(trial, timer, interactions) {
    this.trial = trial;
    this.timer = timer;
    this.interactions = interactions;
    this.submittedInteractions = [];
    this.interactionCollectionIndex = 0;
    this.correct = false;
  }

  submitSingleTokenInteraction(interaction) {
    submitTokenInteraction(
      this,
      interaction,
      singleSizedTokenInteractionsAreEquivalent
    );
  }

  submitDualTokenInteraction(interaction) {
    submitTokenInteraction(
      this,
      interaction,
      dualSizedTokenInteractionsAreEquivalent
    );
  }

  concludeTrial() {
    concludeTrial(this, this.correct);
  }
}
