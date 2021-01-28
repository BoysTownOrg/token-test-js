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
  it("should submit correct trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
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
    expect(trial.result().correct).toBeTrue();
  });

  it("should submit incorrect trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
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
    expect(trial.result().correct).toBeFalse();
  });

  it("should submit correct unordered trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
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
    expect(trial.result().correct).toBeTrue();
  });

  it("should submit incorrect unordered trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
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
    expect(trial.result().correct).toBeFalse();
  });
});
