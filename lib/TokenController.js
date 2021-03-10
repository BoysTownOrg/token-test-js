import { Color, Action, Shape, Size } from "./TokenModel.js";

function color(name) {
  switch (name) {
    case "red":
      return Color.red;
    case "yellow":
      return Color.yellow;
    case "green":
      return Color.green;
    case "white":
      return Color.white;
    case "blue":
      return Color.blue;
    case "black":
      return Color.black;
    default:
      return Color.unknown;
  }
}

function createToken(tokenColorName, tokenIsCircle) {
  return {
    color: color(tokenColorName),
    shape: tokenIsCircle ? Shape.circle : Shape.square,
  };
}

function createSizedToken(tokenColorName, tokenIsCircle, tokenIsSmall) {
  return {
    ...createToken(tokenColorName, tokenIsCircle),
    size: tokenIsSmall ? Size.small : Size.large,
  };
}

export class TokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
    this.control = control;
  }

  notifyThatTokenHasBeenClicked() {
    this.model.submitSingleTokenInteraction({
      token: createToken(
        this.control.tokenClickedColor(),
        this.control.tokenClickedIsCircle()
      ),
      action: Action.touch,
    });
  }

  notifyThatTokenHasBeenDragged() {
    this.tokenBeingDragged = createToken(
      this.control.tokenDraggedColor(),
      this.control.tokenDraggedIsCircle()
    );
  }

  notifyThatTokenHasBeenDroppedOnto() {
    this.model.submitDualTokenInteraction({
      firstToken: this.tokenBeingDragged,
      secondToken: createToken(
        this.control.tokenDroppedOntoColor(),
        this.control.tokenDroppedOntoIsCircle()
      ),
      action: Action.useToTouch,
    });
  }
}

export class SizedTokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
    this.control = control;
  }

  notifyThatTokenHasBeenClicked() {
    this.model.submitSingleSizedTokenInteraction({
      token: createSizedToken(
        this.control.tokenClickedColor(),
        this.control.tokenClickedIsCircle(),
        this.control.tokenClickedIsSmall()
      ),
      action: Action.touch,
    });
  }
}
