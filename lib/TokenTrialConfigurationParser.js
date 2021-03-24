import {
  Action,
  Color,
  InAnyOrder,
  InOrder,
  Shape,
  TokenInteraction,
  Size,
  SizedTokenInteraction,
} from "./TokenModel.js";

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
    case "blue":
      return Color.blue;
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

function size(text) {
  switch (text) {
    case "small":
      return Size.small;
    case "large":
      return Size.large;
    default:
      return Size.unknown;
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

function sizedToken(text) {
  const split = text.split(" ");
  return {
    size: size(split[0]),
    color: color(split[1]),
    shape: shape(split[2]),
  };
}

function dualTokenInteractionUsing(TokenInteractionType, tokenCreator, match) {
  return new TokenInteractionType({
    firstToken: tokenCreator(match.groups.firstToken),
    secondToken: tokenCreator(match.groups.secondToken),
    action: Action.useToTouch,
  });
}

function singleTokenInteractionUsing(
  TokenInteractionType,
  tokenCreator,
  match
) {
  return new TokenInteractionType({
    token: tokenCreator(match.groups.token),
    action: action(match.groups.action),
  });
}

function singleTokenInteraction(match) {
  const split = match.groups.token.split(" ");
  return split.length === 2
    ? singleTokenInteractionUsing(TokenInteraction, token, match)
    : singleTokenInteractionUsing(SizedTokenInteraction, sizedToken, match);
}

function useToTouchTokenInteraction(match) {
  const split = match.groups.firstToken.split(" ");
  return split.length === 2
    ? dualTokenInteractionUsing(TokenInteraction, token, match)
    : dualTokenInteractionUsing(SizedTokenInteraction, sizedToken, match);
}

function destructureSingleRuleOrWrapMultipleRules(RuleType, rules) {
  return rules.length > 1 ? new RuleType(rules) : destructureSingleItem(rules);
}

export function parseTokenInteractionRule(text) {
  return destructureSingleRuleOrWrapMultipleRules(
    InOrder,
    text.split("\n").map((line) =>
      destructureSingleRuleOrWrapMultipleRules(
        InAnyOrder,
        line.split(",").map((interaction) => {
          const trimmedInteraction = interaction.trimStart();
          const possiblyMatchedUseToTouchInteraction = /use (?<firstToken>.*) to touch (?<secondToken>.*)/gu.exec(
            trimmedInteraction
          );
          return possiblyMatchedUseToTouchInteraction === null
            ? singleTokenInteraction(
                /(?<action>.+?) (?<token>(?:small|large)? ?\S+ \S+)$/gu.exec(
                  trimmedInteraction
                )
              )
            : useToTouchTokenInteraction(possiblyMatchedUseToTouchInteraction);
        })
      )
    )
  );
}
