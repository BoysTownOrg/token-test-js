import { TokenController } from "../lib/TokenController.js";
import { Action, Color } from "../lib/TokenModel.js";

class TokenControlStub {
  clickRedSquare() {
    this.observer.notifyThatRedSquareHasBeenClicked();
  }

  attach(observer) {
    this.observer = observer;
  }
}

class TokenModelStub {
  response() {
    return this.response_;
  }

  submitSingleTokenInteraction(response_) {
    this.response_ = response_;
  }
}

describe("Controller", () => {
  it("should submit touch action when user clicks red square", () => {
    const control = new TokenControlStub();
    const model = new TokenModelStub();
    new TokenController(control, model);
    control.clickRedSquare();
    expect(model.response().action).toBe(Action.touch);
    expect(model.response().color).toBe(Color.red);
  });
});
