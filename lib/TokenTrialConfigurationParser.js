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

function token(text) {
  const split = text.split(" ");
  return {
    color: color(split[0]),
    shape: shape(split[1]),
  };
}

function singleTokenInteraction(text) {
  const match = /(?<action>.*) (?<token>\S* \S*)/gu.exec(text);
  return {
    token: token(match.groups.token),
    action: action(match.groups.action),
  };
}

function useToTouchTokenInteraction(regexMatch) {
  return {
    firstToken: token(regexMatch.groups.firstToken),
    secondToken: token(regexMatch.groups.secondToken),
    action: Action.useToTouch,
  };
}

export function parseTokenInteractions(text) {
  return text.split("\n").map((line) =>
    destructureSingleItem(
      line.split(",").map((interaction) => {
        const trimmedInteraction = interaction.trimStart();
        const possiblyMatchedUseToTouchInteraction = /use (?<firstToken>.*) to touch (?<secondToken>.*)/gu.exec(
          trimmedInteraction
        );
        return possiblyMatchedUseToTouchInteraction === null
          ? singleTokenInteraction(trimmedInteraction)
          : useToTouchTokenInteraction(possiblyMatchedUseToTouchInteraction);
      })
    )
  );
}
