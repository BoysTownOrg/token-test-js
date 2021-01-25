import { TokenController } from "../lib/TokenController.js";
import { Action, Color, Shape } from "../lib/TokenModel.js";

class TokenControlStub {
  clickRedSquare() {
    this.observer.notifyThatRedSquareHasBeenClicked();
  }

  dragRedCircle() {
    this.observer.notifyThatRedCircleHasBeenDragged();
  }

  dropOntoGreenSquare() {
    this.observer.notifyThatGreenSquareHasBeenDroppedOnto();
  }

  attach(observer) {
    this.observer = observer;
  }
}

class TokenModelStub {
  singleTokenInteraction() {
    return this.singleTokenInteraction_;
  }

  dualTokenInteraction() {
    return this.dualTokenInteraction_;
  }

  submitSingleTokenInteraction(singleTokenInteraction_) {
    this.singleTokenInteraction_ = singleTokenInteraction_;
  }

  submitDualTokenInteraction(dualTokenInteraction_) {
    this.dualTokenInteraction_ = dualTokenInteraction_;
  }
}

describe("Controller", () => {
  it("should submit touch action when user clicks red square", () => {
    const control = new TokenControlStub();
    const model = new TokenModelStub();
    new TokenController(control, model);
    control.clickRedSquare();
    expect(model.singleTokenInteraction().action).toBe(Action.touch);
    expect(model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(model.singleTokenInteraction().token.shape).toBe(Shape.square);
  });

  it("should submit use-to-touch action when user drags red circle onto green square", () => {
    const control = new TokenControlStub();
    const model = new TokenModelStub();
    new TokenController(control, model);
    control.dragRedCircle();
    control.dropOntoGreenSquare();
    expect(model.dualTokenInteraction().action).toBe(Action.useToTouch);
    expect(model.dualTokenInteraction().firstToken.color).toBe(Color.red);
    expect(model.dualTokenInteraction().firstToken.shape).toBe(Shape.circle);
    expect(model.dualTokenInteraction().secondToken.color).toBe(Color.green);
    expect(model.dualTokenInteraction().secondToken.shape).toBe(Shape.square);
  });
});
