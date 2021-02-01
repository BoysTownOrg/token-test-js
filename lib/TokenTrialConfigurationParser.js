import { Action, Color, Shape } from "./TokenModel.js";

function action(text) {
  switch (text) {
    case "touch":
      return Action.touch;
    case "pick up":
      return Action.pickUp;
    default:
      return Action.unknown;
  }
}

function color(text) {
  switch (text) {
    case "red":
      return Color.red;
    case "yellow":
      return Color.yellow;
    case "white":
      return Color.white;
    case "green":
      return Color.green;
    case "black":
      return Color.black;
    default:
      return Color.unknown;
  }
}

function shape(text) {
  switch (text) {
    case "square":
      return Shape.square;
    case "circle":
      return Shape.circle;
    default:
      return Shape.unknown;
  }
}

export function parseTokenInteractions(text) {
  const split = text.split(" ");
  return [
    {
      token: {
        color: color(split[1]),
        shape: shape(split[2]),
      },
      action: action(split[0]),
    },
  ];
}
