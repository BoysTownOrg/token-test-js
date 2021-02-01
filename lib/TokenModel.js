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
  return (
    a.token.color === b.token.color &&
    a.token.shape === b.token.shape &&
    a.action === b.action
  );
}

function dualTokenInteractionsAreEquivalent(a, b) {
  return (
    a.action === b.action &&
    tokensAreEquivalent(a.firstToken, b.firstToken) &&
    tokensAreEquivalent(a.secondToken, b.secondToken)
  );
}

function containsSingleTokenInteraction(collection, a) {
  return (
    collection.findIndex((interaction) =>
      singleTokenInteractionsAreEquivalent(interaction, a)
    ) !== -1
  );
}

function containsDualTokenInteraction(collection, a) {
  return (
    collection.findIndex((interaction) =>
      dualTokenInteractionsAreEquivalent(interaction, a)
    ) !== -1
  );
}

function removeSingleTokenInteraction(collection, a) {
  collection.splice(
    collection.findIndex((interaction) =>
      singleTokenInteractionsAreEquivalent(interaction, a)
    ),
    1
  );
}

function removeDualTokenInteraction(collection, a) {
  collection.splice(
    collection.findIndex((interaction) =>
      dualTokenInteractionsAreEquivalent(interaction, a)
    ),
    1
  );
}

export class TokenModel {
  constructor(trial, interactions) {
    this.trial = trial;
    this.interactions = interactions;
    this.submittedInteractionCount = 0;
    this.interactionCollectionIndex = 0;
  }

  submitSingleTokenInteraction(interaction) {
    if (this.interactions[this.interactionCollectionIndex].length > 1) {
      if (
        containsSingleTokenInteraction(
          this.interactions[this.interactionCollectionIndex],
          interaction
        )
      ) {
        removeSingleTokenInteraction(
          this.interactions[this.interactionCollectionIndex],
          interaction
        );
        if (this.interactions[this.interactionCollectionIndex].length === 1)
          [
            this.interactions[this.interactionCollectionIndex],
          ] = this.interactions[this.interactionCollectionIndex];
      } else {
        this.trial.conclude({
          correct: false,
        });
        return;
      }
    } else if (
      !singleTokenInteractionsAreEquivalent(
        this.interactions[this.interactionCollectionIndex],
        interaction
      )
    ) {
      this.trial.conclude({
        correct: false,
      });
      return;
    } else this.interactionCollectionIndex += 1;

    this.submittedInteractionCount += 1;
    if (this.interactionCollectionIndex === this.interactions.length)
      this.trial.conclude({
        correct: true,
      });
  }

  submitDualTokenInteraction(interaction) {
    if (this.interactions[this.interactionCollectionIndex].length > 1) {
      if (
        containsDualTokenInteraction(
          this.interactions[this.interactionCollectionIndex],
          interaction
        )
      ) {
        removeDualTokenInteraction(
          this.interactions[this.interactionCollectionIndex],
          interaction
        );
        if (this.interactions[this.interactionCollectionIndex].length === 1)
          [
            this.interactions[this.interactionCollectionIndex],
          ] = this.interactions[this.interactionCollectionIndex];
      } else {
        this.trial.conclude({
          correct: false,
        });
        return;
      }
    } else if (
      !dualTokenInteractionsAreEquivalent(
        this.interactions[this.interactionCollectionIndex],
        interaction
      )
    ) {
      this.trial.conclude({
        correct: false,
      });
      return;
    } else this.interactionCollectionIndex += 1;

    this.submittedInteractionCount += 1;
    if (this.interactionCollectionIndex === this.interactions.length)
      this.trial.conclude({
        correct: true,
      });
  }
}
