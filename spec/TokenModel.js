import { TokenModel, Action, Color, Shape } from "../lib/TokenModel.js";

class TrialStub {
  conclude(result) {
    this.result_ = result;
  }

  result() {
    return this.result_;
  }
}

describe("Model", () => {
  beforeEach(function () {
    this.trial = new TrialStub();
  });

  it("should submit correct trial", function () {
    const model = new TokenModel(this.trial, [
      {
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.touch,
      },
    ]);
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    expect(this.trial.result().correct).toBeTrue();
  });

  it("should submit incorrect trial", function () {
    const model = new TokenModel(this.trial, [
      {
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.touch,
      },
      {
        token: {
          color: Color.green,
          shape: Shape.circle,
        },
        action: Action.touch,
      },
    ]);
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.circle,
      },
      action: Action.touch,
    });
    expect(this.trial.result().correct).toBeFalse();
  });

  it("should submit correct unordered trial", function () {
    const model = new TokenModel(this.trial, [
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
    ]);
    model.submitSingleTokenInteraction({
      token: {
        color: Color.green,
        shape: Shape.circle,
      },
      action: Action.touch,
    });
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    expect(this.trial.result().correct).toBeTrue();
  });

  it("should submit incorrect unordered trial", function () {
    const model = new TokenModel(this.trial, [
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
    ]);
    model.submitSingleTokenInteraction({
      token: {
        color: Color.green,
        shape: Shape.circle,
      },
      action: Action.touch,
    });
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.circle,
      },
      action: Action.touch,
    });
    expect(this.trial.result().correct).toBeFalse();
  });
});
