import { Action, Color, Shape } from "./TokenModel.js";

function action(text) {
  switch (text) {
    case "touch":
      return Action.touch;
    default:
      return Action.unknown;
  }
}

export function parseTokenInteractions(text) {
  const split = text.split(" ");
  return [
    {
      token: {
        color: split[1] === "red" ? Color.red : null,
        shape: split[2] === "square" ? Shape.square : null,
      },
      action: action(split[0]),
    },
  ];
}
