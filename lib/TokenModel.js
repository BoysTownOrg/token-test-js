export const Color = Object.freeze({
  red: 1,
  yellow: 2,
  green: 3,
  white: 4,
  black: 5,
  unknown: 6,
});

export const Shape = Object.freeze({
  square: 1,
  circle: 2,
});

export const Action = Object.freeze({
  touch: 1,
  pickUp: 2,
  useToTouch: 3,
});

function tokensAreEquivalent(a, b) {
  return a.color === b.color && a.shape === b.shape;
}

function singleTokenInteractionsAreEquivalent(a, b) {
  return tokensAreEquivalent(a.token, b.token) && a.action === b.action;
}

function dualTokenInteractionsAreEquivalent(a, b) {
  return (
    a.action === b.action &&
    tokensAreEquivalent(a.firstToken, b.firstToken) &&
    tokensAreEquivalent(a.secondToken, b.secondToken)
  );
}

function containsTokenInteraction(collection, tokenInteraction, comparator) {
  return (
    collection.findIndex((interaction) =>
      comparator(interaction, tokenInteraction)
    ) !== -1
  );
}

function containsSingleTokenInteraction(collection, singleTokenInteraction) {
  return containsTokenInteraction(
    collection,
    singleTokenInteraction,
    singleTokenInteractionsAreEquivalent
  );
}

function containsDualTokenInteraction(collection, dualTokenInteraction) {
  return containsTokenInteraction(
    collection,
    dualTokenInteraction,
    dualTokenInteractionsAreEquivalent
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

function removeSingleTokenInteraction(collection, singleTokenInteraction) {
  return removeTokenInteraction(
    collection,
    singleTokenInteraction,
    singleTokenInteractionsAreEquivalent
  );
}

function removeDualTokenInteraction(collection, dualTokenInteraction) {
  return removeTokenInteraction(
    collection,
    dualTokenInteraction,
    dualTokenInteractionsAreEquivalent
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
    } else {
      tokenModel.trial.conclude({
        correct: false,
      });
      return;
    }
  } else if (
    !comparator(
      tokenModel.interactions[tokenModel.interactionCollectionIndex],
      interaction
    )
  ) {
    tokenModel.trial.conclude({
      correct: false,
    });
    return;
  } else tokenModel.interactionCollectionIndex += 1;

  tokenModel.submittedInteractionCount += 1;
  if (tokenModel.interactionCollectionIndex === tokenModel.interactions.length)
    tokenModel.trial.conclude({
      correct: true,
    });
}

export class TokenModel {
  constructor(trial, interactions) {
    this.trial = trial;
    this.interactions = interactions;
    this.submittedInteractionCount = 0;
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
}
