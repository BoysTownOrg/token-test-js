export const Color = Object.freeze({
  red: 1,
  yellow: 2,
  green: 3,
  white: 4,
  black: 5,
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

export class TokenModel {
  submitSingleTokenInteraction(interaction) {}

  submitDualTokenInteraction(interaction) {}
}
