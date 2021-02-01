import { Action, Color, Shape } from "./TokenModel.js";

export function parseTokenInteractions(text) {
  const split = text.split(" ");
  return [
    {
      token: {
        color: split[1] === "red" ? Color.red : null,
        shape: split[2] === "square" ? Shape.square : null,
      },
      action: split[0] === "touch" ? Action.touch : null,
    },
  ];
}
