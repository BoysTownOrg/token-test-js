import {
  Action,
  Color,
  InAnyOrder,
  InOrder,
  Shape,
  TokenInteraction,
  Size,
  SizedTokenInteraction,
  FirstOrSecond,
  DoNothing,
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

function moveAwayFromTokenInteractionUsing(
  TokenInteractionType,
  tokenCreator,
  match
) {
  return new TokenInteractionType({
    firstToken: tokenCreator(match.groups.firstToken),
    secondToken: tokenCreator(match.groups.secondToken),
    action: Action.moveAwayFrom,
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

function possiblySizedTokenInteraction(
  match,
  tokenText,
  tokenInteractionUsing
) {
  return tokenText.split(" ").length === 2
    ? tokenInteractionUsing(TokenInteraction, token, match)
    : tokenInteractionUsing(SizedTokenInteraction, sizedToken, match);
}

function singleTokenInteraction(match) {
  return possiblySizedTokenInteraction(
    match,
    match.groups.token,
    singleTokenInteractionUsing
  );
}

function useToTouchTokenInteraction(match) {
  return possiblySizedTokenInteraction(
    match,
    match.groups.firstToken,
    dualTokenInteractionUsing
  );
}

function moveAwayFromTokenInteraction(match) {
  return possiblySizedTokenInteraction(
    match,
    match.groups.firstToken,
    moveAwayFromTokenInteractionUsing
  );
}

function putBetweenTokenInteraction(match) {
  return new TokenInteraction({
    firstToken: token(match.groups.firstToken),
    secondToken: token(match.groups.secondToken),
    thirdToken: token(match.groups.thirdToken),
    action: Action.putBetween,
  });
}

function destructureSingleRuleOrWrapMultipleRules(RuleType, rules) {
  return rules.length > 1 ? new RuleType(rules) : rules[0];
}

function tokenInteraction(trimmedInteraction) {
  return trimmedInteraction.includes("use")
    ? useToTouchTokenInteraction(
        /use (?<firstToken>.*) to touch (?<secondToken>.*)/gu.exec(
          trimmedInteraction
        )
      )
    : trimmedInteraction.includes("move")
    ? moveAwayFromTokenInteraction(
        /move (?<firstToken>.*) away from (?<secondToken>.*)/gu.exec(
          trimmedInteraction
        )
      )
    : trimmedInteraction.includes("put")
    ? putBetweenTokenInteraction(
        /put (?<firstToken>.*) between (?<secondToken>.*) and (?<thirdToken>.*)/gu.exec(
          trimmedInteraction
        )
      )
    : trimmedInteraction.includes("nothing")
    ? new DoNothing()
    : singleTokenInteraction(
        /(?<action>.+?) (?<token>(?:small|large)? ?\S+ \S+)$/gu.exec(
          trimmedInteraction
        )
      );
}

export function parseTokenInteractionRule(text) {
  return destructureSingleRuleOrWrapMultipleRules(
    InOrder,
    text.split("\n").map((line) =>
      destructureSingleRuleOrWrapMultipleRules(
        InAnyOrder,
        line.split(",").map((interactionText) => {
          if (interactionText.includes("or")) {
            const optionInteractionText = interactionText.split("or");
            return new FirstOrSecond(
              tokenInteraction(optionInteractionText[0].trimEnd()),
              tokenInteraction(optionInteractionText[1].trimStart())
            );
          }
          return tokenInteraction(interactionText.trimStart());
        })
      )
    )
  );
}
