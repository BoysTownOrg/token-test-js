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

function destructureSingleItem(collection) {
  return collection.length > 1 ? collection : collection[0];
}

export function parseTokenInteractions(text) {
  return text.split("\n").map((line) =>
    destructureSingleItem(
      line.split(", ").map((interaction) => {
        const split = interaction.split(" ");
        return {
          token: {
            color: color(split[split.length - 2]),
            shape: shape(split[split.length - 1]),
          },
          action: action(split.slice(0, split.length - 2).join(" ")),
        };
      })
    )
  );
}
