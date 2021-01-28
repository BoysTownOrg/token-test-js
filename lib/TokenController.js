import { Color, Action, Shape } from "./TokenModel.js";

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
    case "black":
      return Color.black;
    default:
      return Color.unknown;
  }
}

export class TokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
    this.control = control;
  }

  notifyThatTokenHasBeenClicked() {
    this.model.submitSingleTokenInteraction({
      token: {
        color: color(this.control.tokenClickedColor()),
        shape: this.control.tokenClickedIsCircle()
          ? Shape.circle
          : Shape.square,
      },
      action: Action.touch,
    });
  }

  notifyThatRedCircleHasBeenDragged() {
    this.tokenBeingDragged = { color: Color.red, shape: Shape.circle };
  }

  notifyThatGreenSquareHasBeenDroppedOnto() {
    this.model.submitDualTokenInteraction({
      firstToken: this.tokenBeingDragged,
      secondToken: {
        color: Color.green,
        shape: Shape.square,
      },
      action: Action.useToTouch,
    });
  }
}
