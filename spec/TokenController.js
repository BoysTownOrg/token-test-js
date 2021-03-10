import {
  TokenController,
  SizedTokenController,
} from "../lib/TokenController.js";
import { Action, Color, Shape, Size } from "../lib/TokenModel.js";

class TokenControlStub {
  clickRedSquare() {
    this.tokenClickedColor_ = "red";
    this.tokenClickedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenClicked();
  }

  dragRedCircle() {
    this.tokenDraggedColor_ = "red";
    this.tokenDraggedIsCircle_ = true;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dropOntoGreenSquare() {
    this.tokenDroppedOntoColor_ = "green";
    this.tokenDroppedOntoIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
  }

  tokenClickedColor() {
    return this.tokenClickedColor_;
  }

  tokenClickedIsCircle() {
    return this.tokenClickedIsCircle_;
  }

  tokenDraggedColor() {
    return this.tokenDraggedColor_;
  }

  tokenDraggedIsCircle() {
    return this.tokenDraggedIsCircle_;
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOntoColor_;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOntoIsCircle_;
  }

  attach(observer) {
    this.observer = observer;
  }
}

class SizedTokenControlStub {
  clickSmallRedSquare() {
    this.tokenClickedColor_ = "red";
    this.tokenClickedIsCircle_ = false;
    this.tokenClickedIsSmall_ = true;
    this.observer.notifyThatTokenHasBeenClicked();
  }

  tokenClickedColor() {
    return this.tokenClickedColor_;
  }

  tokenClickedIsCircle() {
    return this.tokenClickedIsCircle_;
  }

  tokenClickedIsSmall() {
    return this.tokenClickedIsSmall_;
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

  singleSizedTokenInteraction() {
    return this.singleSizedTokenInteraction_;
  }

  submitSingleTokenInteraction(singleTokenInteraction_) {
    this.singleTokenInteraction_ = singleTokenInteraction_;
  }

  submitDualTokenInteraction(dualTokenInteraction_) {
    this.dualTokenInteraction_ = dualTokenInteraction_;
  }

  submitSingleSizedTokenInteraction(singleSizedTokenInteraction_) {
    this.singleSizedTokenInteraction_ = singleSizedTokenInteraction_;
  }
}

describe("TokenController", () => {
  beforeEach(function () {
    this.control = new TokenControlStub();
    this.model = new TokenModelStub();
    new TokenController(this.control, this.model);
  });

  it("should submit touch action when user clicks red square", function () {
    this.control.clickRedSquare();
    expect(this.model.singleTokenInteraction().action).toBe(Action.touch);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.square);
  });

  it("should submit use-to-touch action when user drags red circle onto green square", function () {
    this.control.dragRedCircle();
    this.control.dropOntoGreenSquare();
    expect(this.model.dualTokenInteraction().action).toBe(Action.useToTouch);
    expect(this.model.dualTokenInteraction().firstToken.color).toBe(Color.red);
    expect(this.model.dualTokenInteraction().firstToken.shape).toBe(
      Shape.circle
    );
    expect(this.model.dualTokenInteraction().secondToken.color).toBe(
      Color.green
    );
    expect(this.model.dualTokenInteraction().secondToken.shape).toBe(
      Shape.square
    );
  });
});

describe("SizedTokenController", () => {
  beforeEach(function () {
    this.control = new SizedTokenControlStub();
    this.model = new TokenModelStub();
    new SizedTokenController(this.control, this.model);
  });

  it("should submit touch action when user clicks small red square", function () {
    this.control.clickSmallRedSquare();
    expect(this.model.singleSizedTokenInteraction().action).toBe(Action.touch);
    expect(this.model.singleSizedTokenInteraction().token.color).toBe(
      Color.red
    );
    expect(this.model.singleSizedTokenInteraction().token.shape).toBe(
      Shape.square
    );
    expect(this.model.singleSizedTokenInteraction().token.size).toBe(
      Size.small
    );
  });
});
