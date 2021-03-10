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

function dualTokenInteractionsAreEquivalent(a, b) {
  return (
    a.action === b.action &&
    tokensAreEquivalent(a.firstToken, b.firstToken) &&
    tokensAreEquivalent(a.secondToken, b.secondToken)
  );
}

function dualSizedTokenInteractionsAreEquivalent(a, b) {
  return (
    a.action === b.action &&
    sizedTokensAreEquivalent(a.firstToken, b.firstToken) &&
    sizedTokensAreEquivalent(a.secondToken, b.secondToken)
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

function submitTokenInteraction(tokenModel, interaction, comparator) {
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
    } else
      tokenModel.trial.conclude({
        correct: false,
      });
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
      tokenModel.trial.conclude({
        correct: true,
      });
  } else
    tokenModel.trial.conclude({
      correct: false,
    });
}

export class TokenModel {
  constructor(trial, interactions) {
    this.trial = trial;
    this.interactions = interactions;
    this.interactionCollectionIndex = 0;
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

  submitSingleSizedTokenInteraction(interaction) {
    submitTokenInteraction(
      this,
      interaction,
      singleSizedTokenInteractionsAreEquivalent
    );
  }

  submitDualSizedTokenInteraction(interaction) {
    submitTokenInteraction(
      this,
      interaction,
      dualSizedTokenInteractionsAreEquivalent
    );
  }
}
