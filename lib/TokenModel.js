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

function singleTokenInteractionsAreEquivalent(a, b) {
  return (
    a.token.color === b.token.color &&
    a.token.shape === b.token.shape &&
    a.action === b.action
  );
}

export class TokenModel {
  constructor(trial, interactions) {
    this.trial = trial;
    this.interactions = interactions;
    this.submittedInteractionCount = 0;
  }

  submitSingleTokenInteraction(interaction) {
    if (
      !singleTokenInteractionsAreEquivalent(
        this.interactions[this.submittedInteractionCount],
        interaction
      )
    ) {
      this.trial.conclude({
        correct: false,
      });
      return;
    }

    this.submittedInteractionCount += 1;
    if (this.submittedInteractionCount === this.interactions.length)
      this.trial.conclude({
        correct: true,
      });
  }

  submitDualTokenInteraction(interaction) {}
}
